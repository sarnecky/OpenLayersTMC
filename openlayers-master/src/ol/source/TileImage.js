/**
 * @module ol/source/TileImage
 */
import {ENABLE_RASTER_REPROJECTION} from '../reproj/common.js';
import {getUid, inherits} from '../index.js';
import ImageTile from '../ImageTile.js';
import TileCache from '../TileCache.js';
import TileState from '../TileState.js';
import {listen} from '../events.js';
import EventType from '../events/EventType.js';
import {equivalent, get as getProjection} from '../proj.js';
import ReprojTile from '../reproj/Tile.js';
import UrlTile from '../source/UrlTile.js';
import {getKey, getKeyZXY} from '../tilecoord.js';
import {getForProjection as getTileGridForProjection} from '../tilegrid.js';

/**
 * @classdesc
 * Base class for sources providing images divided into a tile grid.
 *
 * @constructor
 * @fires ol.source.Tile.Event
 * @extends {ol.source.UrlTile}
 * @param {olx.source.TileImageOptions} options Image tile options.
 * @api
 */
const TileImage = function(options) {

  UrlTile.call(this, {
    attributions: options.attributions,
    cacheSize: options.cacheSize,
    extent: options.extent,
    opaque: options.opaque,
    projection: options.projection,
    state: options.state,
    tileGrid: options.tileGrid,
    tileLoadFunction: options.tileLoadFunction ?
      options.tileLoadFunction : defaultTileLoadFunction,
    tilePixelRatio: options.tilePixelRatio,
    tileUrlFunction: options.tileUrlFunction,
    url: options.url,
    urls: options.urls,
    wrapX: options.wrapX,
    transition: options.transition
  });

  /**
   * @protected
   * @type {?string}
   */
  this.crossOrigin =
      options.crossOrigin !== undefined ? options.crossOrigin : null;

  /**
   * @protected
   * @type {function(new: ol.ImageTile, ol.TileCoord, ol.TileState, string,
   *        ?string, ol.TileLoadFunctionType, olx.TileOptions=)}
   */
  this.tileClass = options.tileClass !== undefined ?
    options.tileClass : ImageTile;

  /**
   * @protected
   * @type {Object.<string, ol.TileCache>}
   */
  this.tileCacheForProjection = {};

  /**
   * @protected
   * @type {Object.<string, ol.tilegrid.TileGrid>}
   */
  this.tileGridForProjection = {};

  /**
   * @private
   * @type {number|undefined}
   */
  this.reprojectionErrorThreshold_ = options.reprojectionErrorThreshold;

  /**
   * @private
   * @type {boolean}
   */
  this.renderReprojectionEdges_ = false;
};

inherits(TileImage, UrlTile);


/**
 * @inheritDoc
 */
TileImage.prototype.canExpireCache = function() {
  if (!ENABLE_RASTER_REPROJECTION) {
    return UrlTile.prototype.canExpireCache.call(this);
  }
  if (this.tileCache.canExpireCache()) {
    return true;
  } else {
    for (const key in this.tileCacheForProjection) {
      if (this.tileCacheForProjection[key].canExpireCache()) {
        return true;
      }
    }
  }
  return false;
};


/**
 * @inheritDoc
 */
TileImage.prototype.expireCache = function(projection, usedTiles) {
  if (!ENABLE_RASTER_REPROJECTION) {
    UrlTile.prototype.expireCache.call(this, projection, usedTiles);
    return;
  }
  const usedTileCache = this.getTileCacheForProjection(projection);

  this.tileCache.expireCache(this.tileCache == usedTileCache ? usedTiles : {});
  for (const id in this.tileCacheForProjection) {
    const tileCache = this.tileCacheForProjection[id];
    tileCache.expireCache(tileCache == usedTileCache ? usedTiles : {});
  }
};


/**
 * @inheritDoc
 */
TileImage.prototype.getGutter = function(projection) {
  if (ENABLE_RASTER_REPROJECTION &&
      this.getProjection() && projection && !equivalent(this.getProjection(), projection)) {
    return 0;
  } else {
    return this.getGutterInternal();
  }
};


/**
 * @protected
 * @return {number} Gutter.
 */
TileImage.prototype.getGutterInternal = function() {
  return 0;
};


/**
 * @inheritDoc
 */
TileImage.prototype.getOpaque = function(projection) {
  if (ENABLE_RASTER_REPROJECTION &&
      this.getProjection() && projection && !equivalent(this.getProjection(), projection)) {
    return false;
  } else {
    return UrlTile.prototype.getOpaque.call(this, projection);
  }
};


/**
 * @inheritDoc
 */
TileImage.prototype.getTileGridForProjection = function(projection) {
  if (!ENABLE_RASTER_REPROJECTION) {
    return UrlTile.prototype.getTileGridForProjection.call(this, projection);
  }
  const thisProj = this.getProjection();
  if (this.tileGrid && (!thisProj || equivalent(thisProj, projection))) {
    return this.tileGrid;
  } else {
    const projKey = getUid(projection).toString();
    if (!(projKey in this.tileGridForProjection)) {
      this.tileGridForProjection[projKey] =
          getTileGridForProjection(projection);
    }
    return /** @type {!ol.tilegrid.TileGrid} */ (this.tileGridForProjection[projKey]);
  }
};


/**
 * @inheritDoc
 */
TileImage.prototype.getTileCacheForProjection = function(projection) {
  if (!ENABLE_RASTER_REPROJECTION) {
    return UrlTile.prototype.getTileCacheForProjection.call(this, projection);
  }
  const thisProj = this.getProjection(); if (!thisProj || equivalent(thisProj, projection)) {
    return this.tileCache;
  } else {
    const projKey = getUid(projection).toString();
    if (!(projKey in this.tileCacheForProjection)) {
      this.tileCacheForProjection[projKey] = new TileCache(this.tileCache.highWaterMark);
    }
    return this.tileCacheForProjection[projKey];
  }
};


/**
 * @param {number} z Tile coordinate z.
 * @param {number} x Tile coordinate x.
 * @param {number} y Tile coordinate y.
 * @param {number} pixelRatio Pixel ratio.
 * @param {ol.proj.Projection} projection Projection.
 * @param {string} key The key set on the tile.
 * @return {!ol.Tile} Tile.
 * @private
 */
TileImage.prototype.createTile_ = function(z, x, y, pixelRatio, projection, key) {
  const tileCoord = [z, x, y];
  const urlTileCoord = this.getTileCoordForTileUrlFunction(
    tileCoord, projection);
  const tileUrl = urlTileCoord ?
    this.tileUrlFunction(urlTileCoord, pixelRatio, projection) : undefined;
  const tile = new this.tileClass(
    tileCoord,
    tileUrl !== undefined ? TileState.IDLE : TileState.EMPTY,
    tileUrl !== undefined ? tileUrl : '',
    this.crossOrigin,
    this.tileLoadFunction,
    this.tileOptions);
  tile.key = key;
  listen(tile, EventType.CHANGE,
    this.handleTileChange, this);
  return tile;
};


/**
 * @inheritDoc
 */
TileImage.prototype.getTile = function(z, x, y, pixelRatio, projection) {
  const sourceProjection = /** @type {!ol.proj.Projection} */ (this.getProjection());
  if (!ENABLE_RASTER_REPROJECTION ||
      !sourceProjection || !projection || equivalent(sourceProjection, projection)) {
    return this.getTileInternal(z, x, y, pixelRatio, sourceProjection || projection);
  } else {
    const cache = this.getTileCacheForProjection(projection);
    const tileCoord = [z, x, y];
    let tile;
    const tileCoordKey = getKey(tileCoord);
    if (cache.containsKey(tileCoordKey)) {
      tile = /** @type {!ol.Tile} */ (cache.get(tileCoordKey));
    }
    const key = this.getKey();
    if (tile && tile.key == key) {
      return tile;
    } else {
      const sourceTileGrid = this.getTileGridForProjection(sourceProjection);
      const targetTileGrid = this.getTileGridForProjection(projection);
      const wrappedTileCoord =
          this.getTileCoordForTileUrlFunction(tileCoord, projection);
      const newTile = new ReprojTile(
        sourceProjection, sourceTileGrid,
        projection, targetTileGrid,
        tileCoord, wrappedTileCoord, this.getTilePixelRatio(pixelRatio),
        this.getGutterInternal(),
        function(z, x, y, pixelRatio) {
          return this.getTileInternal(z, x, y, pixelRatio, sourceProjection);
        }.bind(this), this.reprojectionErrorThreshold_,
        this.renderReprojectionEdges_);
      newTile.key = key;

      if (tile) {
        newTile.interimTile = tile;
        newTile.refreshInterimChain();
        cache.replace(tileCoordKey, newTile);
      } else {
        cache.set(tileCoordKey, newTile);
      }
      return newTile;
    }
  }
};


/**
 * @param {number} z Tile coordinate z.
 * @param {number} x Tile coordinate x.
 * @param {number} y Tile coordinate y.
 * @param {number} pixelRatio Pixel ratio.
 * @param {!ol.proj.Projection} projection Projection.
 * @return {!ol.Tile} Tile.
 * @protected
 */
TileImage.prototype.getTileInternal = function(z, x, y, pixelRatio, projection) {
  let tile = null;
  const tileCoordKey = getKeyZXY(z, x, y);
  const key = this.getKey();
  if (!this.tileCache.containsKey(tileCoordKey)) {
    tile = this.createTile_(z, x, y, pixelRatio, projection, key);
    this.tileCache.set(tileCoordKey, tile);
  } else {
    tile = this.tileCache.get(tileCoordKey);
    if (tile.key != key) {
      // The source's params changed. If the tile has an interim tile and if we
      // can use it then we use it. Otherwise we create a new tile.  In both
      // cases we attempt to assign an interim tile to the new tile.
      const interimTile = tile;
      tile = this.createTile_(z, x, y, pixelRatio, projection, key);

      //make the new tile the head of the list,
      if (interimTile.getState() == TileState.IDLE) {
        //the old tile hasn't begun loading yet, and is now outdated, so we can simply discard it
        tile.interimTile = interimTile.interimTile;
      } else {
        tile.interimTile = interimTile;
      }
      tile.refreshInterimChain();
      this.tileCache.replace(tileCoordKey, tile);
    }
  }
  return tile;
};


/**
 * Sets whether to render reprojection edges or not (usually for debugging).
 * @param {boolean} render Render the edges.
 * @api
 */
TileImage.prototype.setRenderReprojectionEdges = function(render) {
  if (!ENABLE_RASTER_REPROJECTION ||
      this.renderReprojectionEdges_ == render) {
    return;
  }
  this.renderReprojectionEdges_ = render;
  for (const id in this.tileCacheForProjection) {
    this.tileCacheForProjection[id].clear();
  }
  this.changed();
};


/**
 * Sets the tile grid to use when reprojecting the tiles to the given
 * projection instead of the default tile grid for the projection.
 *
 * This can be useful when the default tile grid cannot be created
 * (e.g. projection has no extent defined) or
 * for optimization reasons (custom tile size, resolutions, ...).
 *
 * @param {ol.ProjectionLike} projection Projection.
 * @param {ol.tilegrid.TileGrid} tilegrid Tile grid to use for the projection.
 * @api
 */
TileImage.prototype.setTileGridForProjection = function(projection, tilegrid) {
  if (ENABLE_RASTER_REPROJECTION) {
    const proj = getProjection(projection);
    if (proj) {
      const projKey = getUid(proj).toString();
      if (!(projKey in this.tileGridForProjection)) {
        this.tileGridForProjection[projKey] = tilegrid;
      }
    }
  }
};


/**
 * @param {ol.ImageTile} imageTile Image tile.
 * @param {string} src Source.
 */
function defaultTileLoadFunction(imageTile, src) {
  imageTile.getImage().src = src;
}

export default TileImage;
