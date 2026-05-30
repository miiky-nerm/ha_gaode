import "https://webapi.amap.com/loader.js"

const VERSION = "V5.2.0.1"
const CONFIG_DEVICE_TRACKER_INCLUDE = 'device_tracker_include'
const CONFIG_GAODE_KEY = 'gaode_key'
const CONFIG_GAODE_KEY_SECURITY_CODE = 'gaode_key_security_code'
const CONFIG_CENTER = 'center'
const CONFIG_DEFAULT_TRA_TIME = 'default_tra_time'

const ZONE = 'zone'
const DEVICE_TRACKER = 'device_tracker'
const OTHER = 'other'
const POLYGON_P = 0.001

const random_color = [
    "#00ff00",
    "#00ffff",
    "#4a86e8",
    "#0000ff",
    "#9900ff",
    "#ff00ff",
    "#ff0000",
    "#ff9900",
    "#20124d",
    "#660000",
]

const init_html = `
<style>
  .dxAmap {
    --ha-card-background: var(--card-background-color, var(--primary-background-color));
    --primary-text-color: var(--primary-text-color);
    --secondary-text-color: var(--secondary-text-color);
    --map-controls-background: rgba(30, 30, 30, 0.9);
    --map-controls-color: var(--primary-text-color);
    --map-controls-border: 1px solid var(--divider-color);
    --map-controls-radius: 8px;
    --map-controls-padding: 8px;
    --map-controls-margin: 8px;
    --map-button-background: var(--primary-color);
    --map-button-color: var(--text-primary-color);
    --map-button-hover: var(--primary-color);
    --map-table-border: 1px solid var(--divider-color);
    --map-table-header: var(--secondary-text-color);
    --map-table-row-hover: rgba(255, 255, 255, 0.05);
    position: relative;
    height: 100%;
    width: 100%;
  }

  .dxAmap .kanban {
    color: var(--primary-text-color);
    background:  rgba(var(--primary-background-color-rgb), 0.8);
    border: var(--map-controls-border);
    border-radius: var(--map-controls-radius);
    padding: var(--map-controls-padding);
    margin: var(--map-controls-margin);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(4px);
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 5;
  }

  .flexContainer {
    display: flex;
    align-items: center;
  }

  .amap-marker {
    position: absolute;
    left: 0;
    top: 0;
  }

  .amap-marker-label {
    position: absolute;
    z-index: 2;
    background-color: var(--primary-color);
    color: var(--text-primary-color);
    white-space: nowrap;
    cursor: default;
    padding: 3px;
    font-size: 12px;
    line-height: 14px;
    border: 0;
    border-radius: 4px;
  }

  button {
    background-color: var(--map-button-background);
    color: var(--map-button-color);
    border: none;
    border-radius: 4px;
    padding: 6px 12px;
    margin: 2px;
    cursor: pointer;
    font-size: 0.9em;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: var(--map-button-hover);
    opacity: 0.9;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  input[type="text"],
  input[type="datetime-local"] {
    background-color: var(--input-background-color, rgba(255, 255, 255, 0.05));
    color: var(--primary-text-color);
    border: 1px solid var(--divider-color);
    border-radius: 4px;
    padding: 6px;
    margin: 4px 0;
    width: 100%;
    box-sizing: border-box;
  }

  input[type="checkbox"] {
    margin-right: 4px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0;
    color: var(--primary-text-color);
  }

  th, td {
    padding: 8px;
    text-align: left;
    border-bottom: var(--map-table-border);
  }

  tr:hover {
    background-color: var(--map-table-row-hover);
  }

  th {
    color: var(--map-table-header);
    font-weight: 500;
  }

  .section-title {
    font-size: 1.1em;
    margin: 8px 0;
    color: var(--primary-text-color);
    font-weight: 500;
  }

  .error-text {
    color: var(--error-color);
    font-size: 0.9em;
  }
  .mapContainer {
    height: 100%;
    width: 100%;
    position: relative;
    z-index: 1;
  }
</style>
<div id="dxMapDiv" class="dxAmap" style="height: 100%">
  <div style="display: flex; height: 100%; position: relative;">
    <div style="height: 100%; width: 100%;" id="mapContainer" class="mapContainer"></div>
    
    <!-- Expanded Controls Panel -->
    <div id="maxDiv" class="kanban" style="width: 500px; max-height: 90vh; overflow-y: auto;">
      <div class="flexContainer" style="margin-bottom: 12px; justify-content: space-between;">
        <button id="containerMin" class="mdc-icon-button">
          <ha-icon icon="mdi:chevron-left"></ha-icon>
        </button>
        <div style="font-size: 0.9em; color: var(--secondary-text-color)">版本：${VERSION}</div>
      </div>

      <div style="margin-bottom: 16px;">
        <div class="section-title">地图操作</div>
        <div style="margin-bottom: 8px; font-size: 0.9em;">
          点击坐标：<span id="click_ll_span" style="user-select: text;"></span>
        </div>
        <div style="margin-bottom: 8px;">
          <div style="display: flex; flex-wrap: wrap; gap: 12px;">
            <div style="display: flex; align-items: center;">
              <ha-switch id="satellite_input" style="--switch-checked-color: var(--primary-color);"></ha-switch>
              <span style="margin-left: 8px; font-size: 0.9em;">卫星</span>
            </div>
            <div style="display: flex; align-items: center;">
              <ha-switch id="roadnet_input" style="--switch-checked-color: var(--primary-color);"></ha-switch>
              <span style="margin-left: 8px; font-size: 0.9em;">路网</span>
            </div>
            <div style="display: flex; align-items: center;">
              <ha-switch id="traffic_input" style="--switch-checked-color: var(--primary-color);"></ha-switch>
              <span style="margin-left: 8px; font-size: 0.9em;">交通</span>
            </div>
          </div>
        </div>
      </div>
      <div id="zoneDiv">
        <div class="flexContainer" style="margin-bottom: 8px; justify-content: space-between;">
          <div class="section-title">区域管理</div>
          <button id="zone_add" class="mdc-icon-button">
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>
        </div>

        <table id="zoneContainer" style="margin-bottom: 16px;"></table>

        <div style="display: none; margin-bottom: 16px;" id="zoneSet">
          <div class="section-title" style="margin-bottom: 8px;">区域设置</div>

          <div id="zone_id_div" style="margin-bottom: 8px; display: none;">
            <div style="font-size: 0.9em; margin-bottom: 4px;">ID</div>
            <input disabled id="entity_id_post_input" type="text" name="entity_id_post">
          </div>
          
          <div style="margin-bottom: 8px;">
            <div style="font-size: 0.9em; margin-bottom: 4px;">名称</div>
            <input id="friendly_name_input" type="text" name="friendly_name" placeholder="输入区域名称">
          </div>
          
          <div style="margin-bottom: 8px;">
            <div style="font-size: 0.9em; margin-bottom: 4px;">经纬度</div>
            <input id="ll_input" type="text" name="ll" placeholder="经度,纬度">
          </div>
          
          <div style="margin-bottom: 12px;">
            <div style="font-size: 0.9em; margin-bottom: 4px;">范围</div>
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
              <input id="radius_input" type="text" name="radius" placeholder="半径(米)" style="flex: 1;">
              <button id="change_to_polygon">多边形</button>
              <button id="change_to_radius">圆形</button>
            </div>
            <input style="display: none;" id="polygon_input" type="text" name="polygon">
          </div>
          
          <div style="display: flex; justify-content: flex-end; gap: 8px;">
            <button id="zoneSetCancel">取消</button>
            <button id="zoneSetCommit" style="background-color: var(--success-color);">保存</button>
          </div>
        </div>
      </div>

      <div id="gpsDiv">
        <div class="section-title" style="margin-bottom: 8px;">设备轨迹</div>
        <table id="gpsList" style="margin-bottom: 16px;"></table>
        
        <div style="display: none" id="gps_set">
          <div class="section-title" style="margin-bottom: 8px;">轨迹设置</div>

          <div style="display: none">
            <input id="gps_entity_id_post_input" type="text" name="gps_entity_id_post">
          </div>
          
          <div style="margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-size: 0.9em; margin-bottom: 4px;">设备名称</div>
              <div id="gps_friendly_name_div" style="font-weight: 500;"></div>
            </div>
            <button id="gps_set_cancel">取消</button>
          </div>
          
          <div style="margin-bottom: 12px;">
            <div style="font-size: 0.9em; margin-bottom: 4px;">时间范围</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 4px;">
              <input id="trajectory_start_datetime" type="datetime-local" step="60">
              <input id="trajectory_end_datetime" type="datetime-local" step="60">
            </div>
            <div id="trajectory_error" class="error-text"></div>
          </div>
          
          <div style="display: flex; justify-content: flex-end;">
            <button id="gps_set_trajectory" style="background-color: var(--success-color);">绘制轨迹</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Minimized Controls Panel -->
    <div id="minDiv" class="kanban" style="display: none;">
      <button id="containerMax" class="mdc-icon-button">
        <ha-icon icon="mdi:chevron-right"></ha-icon>
      </button>
    </div>
  </div>
</div>
`

class Ha_gaode extends HTMLElement {
    constructor() {
        super()
        this.mapLoading = false
        this.zoneEdit = false
        this.gpsEdit = false
        this.trajectoryMode = false
        this.editMarker = null
        this.editMarkerCircle = null
        this.amap = null
        this.zoneObj = {}
        this.gpsObj = {}
        this.zoneMarkerObj = {}
        this.zoneMarkerCircleObj = {}
        this.gpsCache = {}
        this.gpsList = []
        this.searchMarker = null
        this.carMarker = null
        this.carPolyline = null
        this.carPassedPolyline = null
        this._hass = null
        this.config = null
        this.content = null
    }

    static getConfigElement() {
        // 返回配置编辑器（如果需要自定义配置UI，可以在这里返回）
        return null
    }

    set hass(hass) {
        this._hass = hass
        if (!this.content) {
            if (!this.shadowRoot) {
                this.attachShadow({ mode: 'open' })
            }
            this.shadowRoot.innerHTML = init_html
            this.content = this.shadowRoot.querySelector("#dxMapDiv")
            this._loadMap(hass)
            this._drawOnce(hass)
        }
        this._handleHass(hass)
    }

    get hass() {
        return this._hass
    }

    _getEntityPosition(attributes) {
        if (!attributes) return null

        const lng =
            attributes.gcj02_longitude ??
            attributes.longitude ??
            null

        const lat =
            attributes.gcj02_latitude ??
            attributes.latitude ??
            null

        if (lng == null || lat == null) {
            return null
        }

        return {
            lng: parseFloat(lng),
            lat: parseFloat(lat)
        }
    }

    _get_marker_options(type, friendly_name, gcj02_longitude, gcj02_latitude) {
        let basic = {
            map: this.amap,
            name: friendly_name,
            position: [gcj02_longitude, gcj02_latitude],
            zooms: [3, 20],
            opacity: 1,
            label: {
                content: `<div>${friendly_name}</div>`,
                offset: new AMap.Pixel(0, -30),
                direction: 'center'
            }
        }
        return basic
    }

    _get_circle_options(type, radius, gcj02_longitude, gcj02_latitude) {
        let basic = {
            map: this.amap,
            center: [gcj02_longitude, gcj02_latitude],
            radius: radius,
            fillOpacity: 0.3,
            strokeColor: '#14b4fc',
            strokeOpacity: 0.3,
            fillColor: '#14b4fc',
            strokeWeight: 0
        }
        return basic
    }

    _get_polygon_options(type, polygon_arr) {
        const basic = {
            path: polygon_arr,
            strokeColor: "#14b4fc",
            strokeWeight: 6,
            strokeOpacity: 0.3,
            fillOpacity: 0.4,
            fillColor: '#14b4fc',
            draggable: false
        }
        return basic
    }

    _drawWindow(hass) {
        let that = this;
        let zoneContainer = this.shadowRoot.querySelector("#zoneContainer")
        zoneContainer.innerHTML = ''
        var rootTr = document.createElement(`tr`)
        rootTr.innerHTML = `
      <td>名称</td>
      <td>经纬度</td>
      <td>范围</td>
      <td>操作</td>
    `
        zoneContainer.appendChild(rootTr)
        for (let zoneKey in this.zoneObj) {
            const zone = this.zoneObj[zoneKey]
            const position = this._getEntityPosition(zone.attributes)
            if (!position) {
                continue
            }
            const gcj02_longitude = position.lng
            const gcj02_latitude = position.lat
            const { friendly_name, radius } = zone.attributes
            var trE = document.createElement(`tr`)
            var key = zoneKey.replaceAll('\.', '')
            let positionText = ''
            if (gcj02_longitude != null && gcj02_latitude != null) {
                positionText = gcj02_longitude + "," + gcj02_latitude
            }
            trE.innerHTML = `
          <td >${friendly_name}</td>
          <td style='cursor: pointer' id=${key + '_ll'}>${positionText}</td>
          <td >${parseInt(radius)}</td>
          <td>
            <button id=${key + '_edit'} dx_entity_id=${zoneKey}>编辑</button>
            <button ${key === 'zonehome' ? "disabled" : ""} id=${key + '_delete'} dx_entity_id=${zoneKey}>删除</button>
          </td>
      `
            zoneContainer.appendChild(trE)
            let zoneKeyLl = this.shadowRoot.querySelector(`#${key}_ll`)
            if (zoneKeyLl) {
                zoneKeyLl.addEventListener('click', () => {
                    if (this.amap) {
                        this.amap.setCenter([gcj02_longitude, gcj02_latitude])
                    }
                })
            }
            let zoneKeyEdit = this.shadowRoot.querySelector(`#${key}_edit`)
            if (zoneKeyEdit) {
                zoneKeyEdit.addEventListener('click', () => {
                    const entityId = zoneKeyEdit.getAttribute('dx_entity_id')
                    const zone = this.zoneObj[entityId]
                    const { friendly_name, gcj02_longitude, gcj02_latitude, radius, dx_polygon } = zone.attributes
                    var zomeForm = this._getZoneForm()
                    zomeForm.entity_id_post_input.value = zone.entity_id
                    zomeForm.friendly_name_input.value = friendly_name
                    if (gcj02_longitude != null && gcj02_latitude != null) {
                        zomeForm.ll_input.value = gcj02_longitude + "," + gcj02_latitude
                    }
                    zomeForm.radius_input.value = radius
                    if (dx_polygon) {
                        zomeForm.polygon_input.value = dx_polygon
                    } else {
                        zomeForm.polygon_input.value = null
                    }
                    this._showZoneForm()
                    this._drawMap(true)
                })
            }

            let zoneKeyDelete = this.shadowRoot.querySelector(`#${key}_delete`)
            if (zoneKeyDelete) {
                zoneKeyDelete.addEventListener('click', async () => {
                    const entityId = zoneKeyDelete.getAttribute('dx_entity_id')
                    const arr = entityId.split('.')
                    await hass.callWS({
                        type: "zone/delete",
                        zone_id: arr[1]
                    })
                })
            }
        }

        // GPS
        let gpsList = this.shadowRoot.querySelector("#gpsList")
        gpsList.innerHTML = ''
        var rootTr = document.createElement(`tr`)
        rootTr.innerHTML = `
      <td>名称</td>
      <td>最新经纬度</td>
      <td>操作</td>
    `
        gpsList.appendChild(rootTr)
        for (let gpsKey in this.gpsObj) {
            const gps = this.gpsObj[gpsKey]
            const position = this._getEntityPosition(gps.attributes)
            if (!position) {
                continue
            }
            const gcj02_longitude = position.lng
            const gcj02_latitude = position.lat
            const friendly_name = gps.attributes.friendly_name || gps.entity_id
            var trE = document.createElement(`tr`)
            var key = gpsKey.replaceAll('\.', '')
            trE.innerHTML = `
          <td >${friendly_name}</td>
          <td style='cursor: pointer' id=${key + '_ll'}>${gcj02_longitude + "," + gcj02_latitude}</td>
          <td>
            <button id=${key + '_oper'} dx_entity_id=${gpsKey}>操作</button>
          </td>
      `
            gpsList.appendChild(trE)
            let gpsView = this.shadowRoot.querySelector(`#${key}_ll`)
            if (gpsView) {
                gpsView.addEventListener('click', () => {
                    if (this.amap) {
                        this.amap.setCenter([gcj02_longitude, gcj02_latitude])
                    }
                })
            }
            let gpsOper = this.shadowRoot.querySelector(`#${key}_oper`)
            if (gpsOper) {
                gpsOper.addEventListener('click', () => {
                    const entityId = gpsOper.getAttribute('dx_entity_id')
                    const gps = this.gpsObj[entityId]
                    const { friendly_name, gcj02_longitude, gcj02_latitude } = gps.attributes

                    this._showGpsForm({
                        position: [gcj02_longitude, gcj02_latitude],
                        friendly_name: friendly_name,
                        entity_id: entityId,
                    })

                    var gpsForm = this._getGpsForm()
                    gpsForm.gps_entity_id_post_input.value = gps.entity_id
                    gpsForm.gps_friendly_name_div.innerHTML = friendly_name
                })
            }
        }
    }

    _toTrajectory(arr) {
        const that = this
        if (arr.length > 0) {
            this._clearTrajectory()

            this.carPolyline = new AMap.Polyline({
                map: this.amap,
                showDir: true,
                strokeColor: "#28F",
                strokeWeight: 6,
            })
            this.carPassedPolyline = new AMap.Polyline({
                map: this.amap,
                strokeColor: "#AF5",
                strokeWeight: 6,
            })
            this.carMarker = new AMap.Marker({
                map: this.amap,
                position: arr[0],
                icon: "https://webapi.amap.com/images/car.png",
                offset: new AMap.Pixel(-26, -13),
                autoRotation: true,
                angle: -90,
            })
            this.carMarker.on('moving', function (e) {
                that.carPassedPolyline.setPath(e.passedPath)
            })
            this.amap.setZoomAndCenter(17, arr[0])
            this.carPolyline.setPath(arr)
            this.carMarker.moveAlong(arr, 200)
            this.trajectoryMode = true
        }
    }

    _clearTrajectory() {
        if (this.carMarker) {
            this.amap.remove(this.carMarker)
            this.carMarker = null
        }
        if (this.carPolyline) {
            this.amap.remove(this.carPolyline)
            this.carPolyline = null
        }
        if (this.carPassedPolyline) {
            this.amap.remove(this.carPassedPolyline)
            this.carPassedPolyline = null
        }
    }

    _closeTrajectory() {
        this.trajectoryMode = false
        this._clearTrajectory()
        this._drawMap()
    }

    _drawOnce(hass) {
        let change_to_polygon = this.shadowRoot.querySelector("#change_to_polygon")
        let change_to_radius = this.shadowRoot.querySelector("#change_to_radius")

        if (change_to_polygon) {
            change_to_polygon.addEventListener('click', async () => {
                const { radius_input, polygon_input } = this._getZoneForm()
                radius_input.style.display = "none"
                polygon_input.style.display = "inline-block"
                const { gcj02_longitude, gcj02_latitude, dx_polygon } = this._getZoneFormValues()
                if (!dx_polygon) {
                    const polygon_arr = []
                    polygon_arr.push([(parseFloat(gcj02_longitude) + POLYGON_P).toFixed(6) + "," + (parseFloat(gcj02_latitude) + POLYGON_P).toFixed(6)])
                    polygon_arr.push([(parseFloat(gcj02_longitude) + POLYGON_P).toFixed(6) + "," + (parseFloat(gcj02_latitude) - POLYGON_P).toFixed(6)])
                    polygon_arr.push([(parseFloat(gcj02_longitude) - POLYGON_P).toFixed(6) + "," + (parseFloat(gcj02_latitude) - POLYGON_P).toFixed(6)])
                    polygon_arr.push([(parseFloat(gcj02_longitude) - POLYGON_P).toFixed(6) + "," + (parseFloat(gcj02_latitude) + POLYGON_P).toFixed(6)])
                    polygon_input.value = polygon_arr.join(';')
                }
                this._drawMap()
            })
        }

        if (change_to_radius) {
            change_to_radius.addEventListener('click', async () => {
                const { radius_input, polygon_input } = this._getZoneForm()
                radius_input.style.display = "inline-block"
                polygon_input.style.display = "none"
                polygon_input.value = null
                this._drawMap()
            })
        }

        let zone_add = this.shadowRoot.querySelector("#zone_add")
        if (zone_add) {
            zone_add.addEventListener('click', async () => {
                var zomeForm = this._getZoneForm()
                zomeForm.entity_id_post_input.value = null
                zomeForm.friendly_name_input.value = null
                zomeForm.ll_input.value = null
                zomeForm.radius_input.value = null
                this._showZoneForm()
                this._drawMap(true)
            })
        }

        let zoneSetCancel = this.shadowRoot.querySelector("#zoneSetCancel")
        if (zoneSetCancel) {
            zoneSetCancel.addEventListener('click', () => {
                this._hideZoneForm()
                this._drawMap()
            })
        }

        let zoneSetCommit = this.shadowRoot.querySelector("#zoneSetCommit")
        if (zoneSetCommit) {
            zoneSetCommit.addEventListener('click', async () => {
                var valueObj = this._getZoneFormValues()
                const entity_id = valueObj.entity_id
                if (!valueObj.radius) {
                    valueObj.radius = 0
                }
                if (entity_id) {
                    // 编辑
                    await hass.callApi('post', 'dx/zone/save', {
                        ...valueObj
                    })
                } else {
                    // 创建
                    var v = {
                        name: valueObj.friendly_name,
                        latitude: 90,
                        longitude: 90,
                        radius: valueObj.radius,
                        passive: false
                    }
                    const zone_new = await hass.callWS({
                        type: "zone/create",
                        ...v
                    })
                    await hass.callApi('post', 'dx/zone/save', {
                        ...valueObj,
                        entity_id: 'zone.' + zone_new.id
                    })
                }
                this._hideZoneForm()
                this._drawMap()
            })
        }

        let radiusInput = this.shadowRoot.querySelector("#radius_input")
        if (radiusInput) {
            radiusInput.addEventListener('change', (e) => {
                this._drawMap()
            })
        }

        let friendly_name_input = this.shadowRoot.querySelector("#friendly_name_input")
        if (friendly_name_input) {
            friendly_name_input.addEventListener('change', (e) => {
                this._drawMap()
            })
        }

        let ll_input = this.shadowRoot.querySelector("#ll_input")
        if (ll_input) {
            ll_input.addEventListener('change', (e) => {
                this._drawMap(true)
            })
        }

        let containerMin = this.shadowRoot.querySelector("#containerMin")
        let containerMax = this.shadowRoot.querySelector("#containerMax")
        let minDiv = this.shadowRoot.querySelector("#minDiv")
        let maxDiv = this.shadowRoot.querySelector("#maxDiv")

        if (containerMin) {
            containerMin.addEventListener('click', (e) => {
                minDiv.style.display = 'block'
                maxDiv.style.display = 'none'
            })
        }

        if (containerMax) {
            containerMax.addEventListener('click', (e) => {
                maxDiv.style.display = 'block'
                minDiv.style.display = 'none'
            })
        }

        let gps_set_cancel = this.shadowRoot.querySelector("#gps_set_cancel")
        if (gps_set_cancel) {
            gps_set_cancel.addEventListener('click', () => {
                this._hideGpsForm()
                this._drawMap()
            })
        }

        let gpsSetTrajectory = this.shadowRoot.querySelector("#gps_set_trajectory")
        if (gpsSetTrajectory) {
            gpsSetTrajectory.addEventListener('click', async () => {
                const { entity_id, trajectory_start_datetime_seconds, trajectory_end_datetime_seconds } = this._getGpsFormValues()
                let trajectory_error = this.shadowRoot.querySelector("#trajectory_error")
                if (!trajectory_start_datetime_seconds || !trajectory_end_datetime_seconds) {
                    trajectory_error.innerHTML = "轨迹时间必填!"
                    return;
                } else {
                    trajectory_error.innerHTML = null
                }
                if (trajectory_start_datetime_seconds >= trajectory_end_datetime_seconds) {
                    trajectory_error.innerHTML = "开始时间必须早于结束时间!"
                    return;
                }
                let msg = await hass.callApi('get', `dx/gps/gps_list_from_db?entity_id=${encodeURIComponent(entity_id)}&start_time_seconds=${trajectory_start_datetime_seconds}&end_time_seconds=${trajectory_end_datetime_seconds}`)
                if (!msg || msg.length === 0) {
                    trajectory_error.innerHTML = "该时间范围内没有轨迹数据!"
                    return;
                }
                var arr = []
                for (let i = 0; i < msg.length; i++) {
                    const element = msg[i];
                    arr.push([parseFloat(element.gcj02_longitude), parseFloat(element.gcj02_latitude)])
                }
                trajectory_error.innerHTML = null
                this._toTrajectory(arr)
            })
        }

        this._bindTrajectoryDatetimeInput("#trajectory_start_datetime")
        this._bindTrajectoryDatetimeInput("#trajectory_end_datetime")

        let satellite_input = this.shadowRoot.querySelector("#satellite_input")
        if (satellite_input) {
            satellite_input.addEventListener('change', (e) => {
                if (!this.amap) return
                if (satellite_input.checked) {
                    this.amap.add(this.satelliteLayer)
                } else {
                    this.amap.remove(this.satelliteLayer)
                }
            })
        }

        let roadnet_input = this.shadowRoot.querySelector("#roadnet_input")
        if (roadnet_input) {
            roadnet_input.addEventListener('change', (e) => {
                if (!this.amap) return
                if (roadnet_input.checked) {
                    this.amap.add(this.roadnetLayer)
                } else {
                    this.amap.remove(this.roadnetLayer)
                }
            })
        }

        let traffic_input = this.shadowRoot.querySelector("#traffic_input")
        if (traffic_input) {
            traffic_input.addEventListener('change', (e) => {
                if (!this.amap) return
                if (traffic_input.checked) {
                    this.amap.add(this.trafficLayer)
                } else {
                    this.amap.remove(this.trafficLayer)
                }
            })
        }
    }

    _showGpsForm(obj) {
        if (!this.amap) return
        this.amap.setCenter(obj.position)
        let gpsSet = this.shadowRoot.querySelector("#gps_set")
        if (gpsSet) {
            gpsSet.style.display = "block"
        }
        this.gpsEdit = true
        const trajectory_start_datetime = this.shadowRoot.querySelector("#trajectory_start_datetime")
        const trajectory_end_datetime = this.shadowRoot.querySelector("#trajectory_end_datetime")

        if (trajectory_end_datetime) {
            const endDate = new Date();
            trajectory_end_datetime.value = this.to_datetime_string(endDate);
        }

        if (trajectory_start_datetime) {
            const startDate = new Date();
            startDate.setHours(0, 0, 0, 0);
            trajectory_start_datetime.value = this.to_datetime_string(startDate);
        }

        if (this.config && this.config[CONFIG_DEFAULT_TRA_TIME]) {
            const date = new Date()
            if (trajectory_end_datetime) {
                trajectory_end_datetime.value = this.to_datetime_string(date);
            }
            date.setTime(date.getTime() - this.config[CONFIG_DEFAULT_TRA_TIME] * 60 * 1000);
            if (trajectory_start_datetime) {
                trajectory_start_datetime.value = this.to_datetime_string(date);
            }
        }
    }

    _hideGpsForm() {
        let gpsSet = this.shadowRoot.querySelector("#gps_set")
        if (gpsSet) {
            gpsSet.style.display = "none"
        }
        this.gpsEdit = false
        this._clearGpsFormValues()
        this._closeTrajectory()
    }

    _drawEditModeMap(set_center) {
        if (!this.amap) return
        this.amap.clearMap()
        const valueObj = this._getZoneFormValues()
        const { friendly_name, gcj02_longitude, gcj02_latitude, radius, dx_polygon } = valueObj
        let position;
        if (gcj02_longitude != null && gcj02_latitude != null) {
            position = [gcj02_longitude, gcj02_latitude]
        }
        if (set_center && position) {
            this.amap.setCenter(position)
        }
        if (position) {
            new AMap.Marker(this._get_marker_options(ZONE, friendly_name, gcj02_longitude, gcj02_latitude))
        }
        const polygon_arr = this._transform_polygon_2_array(dx_polygon)
        if (polygon_arr && position) {
            var b = new AMap.Polygon(this._get_polygon_options(ZONE, polygon_arr))
            this.amap.add(b)
            const polygon_input = this.shadowRoot.querySelector("#polygon_input")
            if (polygon_input) {
                const polyEditor = new AMap.PolyEditor(this.amap, b)
                polyEditor.on('adjust', function (event) {
                    let now_arr = []
                    let now_path_arr = event.target.getPath()
                    for (let i = 0; i < now_path_arr.length; i++) {
                        const lng = now_path_arr[i].lng
                        const lat = now_path_arr[i].lat
                        now_arr.push([lng.toFixed(6) + "," + lat.toFixed(6)])
                    }
                    polygon_input.value = now_arr.join(';')
                })
                polyEditor.open()
            }
        } else if (radius != null && position) {
            new AMap.Circle(this._get_circle_options(ZONE, radius, gcj02_longitude, gcj02_latitude))
        }
    }

    _showZoneForm() {
        let zone_id_div = this.shadowRoot.querySelector("#zone_id_div")
        let radius_input = this.shadowRoot.querySelector("#radius_input")
        let polygon_input = this.shadowRoot.querySelector("#polygon_input")

        const valueObj = this._getZoneFormValues()
        const { entity_id, dx_polygon } = valueObj
        if (!entity_id && zone_id_div) {
            zone_id_div.style.display = "none"
        } else if (zone_id_div) {
            zone_id_div.style.display = "block"
        }
        let zoneSet = this.shadowRoot.querySelector("#zoneSet")
        if (zoneSet) {
            zoneSet.style.display = "block"
        }
        this.zoneEdit = true
        if (!dx_polygon || dx_polygon === '') {
            if (radius_input) radius_input.style.display = "inline-block"
            if (polygon_input) polygon_input.style.display = "none"
        } else {
            if (radius_input) radius_input.style.display = "none"
            if (polygon_input) polygon_input.style.display = "inline-block"
        }
    }

    _hideZoneForm() {
        let zoneSet = this.shadowRoot.querySelector("#zoneSet")
        if (zoneSet) {
            zoneSet.style.display = "none"
        }
        this.zoneEdit = false
        this._clearZoneFormValues()
    }

    _getGpsForm() {
        return {
            gps_entity_id_post_input: this.shadowRoot.querySelector("#gps_entity_id_post_input"),
            gps_friendly_name_div: this.shadowRoot.querySelector("#gps_friendly_name_div"),
            trajectory_start_datetime: this.shadowRoot.querySelector("#trajectory_start_datetime"),
            trajectory_end_datetime: this.shadowRoot.querySelector("#trajectory_end_datetime"),
            trajectory_error: this.shadowRoot.querySelector("#trajectory_error")
        }
    }

    _getZoneForm() {
        return {
            friendly_name_input: this.shadowRoot.querySelector("#friendly_name_input"),
            ll_input: this.shadowRoot.querySelector("#ll_input"),
            radius_input: this.shadowRoot.querySelector("#radius_input"),
            entity_id_post_input: this.shadowRoot.querySelector("#entity_id_post_input"),
            polygon_input: this.shadowRoot.querySelector("#polygon_input"),
        }
    }

    _getZoneFormValues() {
        const form = this._getZoneForm()
        const ll = form.ll_input?.value || ''
        const llArray = ll.split(",")
        return {
            entity_id: form.entity_id_post_input?.value || '',
            friendly_name: form.friendly_name_input?.value || '',
            gcj02_longitude: llArray[0] || '',
            gcj02_latitude: llArray[1] || '',
            radius: parseInt(form.radius_input?.value || '0'),
            dx_polygon: form.polygon_input?.value || ''
        }
    }

    _getGpsFormValues() {
        const form = this._getGpsForm()
        if (form.trajectory_error) {
            form.trajectory_error.innerHTML = null
        }
        let trajectory_start_datetime_seconds = null
        if (form.trajectory_start_datetime?.value) {
            trajectory_start_datetime_seconds = Math.floor(new Date(form.trajectory_start_datetime.value) / 1000);
        }
        let trajectory_end_datetime_seconds = null
        if (form.trajectory_end_datetime?.value) {
            trajectory_end_datetime_seconds = Math.floor(new Date(form.trajectory_end_datetime.value) / 1000);
        }
        return {
            entity_id: form.gps_entity_id_post_input?.value || '',
            trajectory_start_datetime_seconds,
            trajectory_end_datetime_seconds,
        }
    }

    _bindTrajectoryDatetimeInput(selector) {
        const input = this.shadowRoot.querySelector(selector)
        if (!input) return
        const stopMapEvent = (e) => {
            e.stopPropagation()
        }
        input.addEventListener('pointerdown', stopMapEvent)
        input.addEventListener('click', stopMapEvent)
        input.addEventListener('dblclick', (e) => {
            stopMapEvent(e)
            if (typeof input.showPicker === 'function') {
                input.showPicker()
            }
        })
    }

    _clearZoneFormValues() {
        const form = this._getZoneForm()
        if (form.entity_id_post_input) form.entity_id_post_input.value = null
        if (form.friendly_name_input) form.friendly_name_input.value = null
        if (form.ll_input) form.ll_input.value = null
        if (form.radius_input) form.radius_input.value = null
        if (form.polygon_input) form.polygon_input.value = null
    }

    _clearGpsFormValues() {
        const form = this._getGpsForm()
        if (form.gps_entity_id_post_input) form.gps_entity_id_post_input.value = null
        if (form.gps_friendly_name_div) form.gps_friendly_name_div.innerHTML = null
        if (form.trajectory_start_datetime) form.trajectory_start_datetime.value = null
        if (form.trajectory_end_datetime) form.trajectory_end_datetime.value = null
        if (form.trajectory_error) form.trajectory_error.innerHTML = null
    }

    _handleHass(hass) {
        let that = this
        let { states } = hass;
        let device_tracker_include = this.config[CONFIG_DEVICE_TRACKER_INCLUDE]
        let now_zone_list = []
        let now_gps_list = []
        let has_change = false;
        for (let stateKey in states) {
            if (stateKey.startsWith('zone.')) {
                let entity = states[stateKey]
                let { longitude, latitude, gcj02_longitude, gcj02_latitude } = entity.attributes
                if (longitude != null && latitude != null) {
                    const old_zone = this.zoneObj[stateKey]
                    if (old_zone) {
                        if (old_zone.last_updated != entity.last_updated) {
                            has_change = true
                        }
                    } else {
                        has_change = true
                    }
                    this.zoneObj[stateKey] = entity
                }
                now_zone_list.push(stateKey)
            } else if (stateKey.startsWith('device_tracker.') || stateKey.startsWith('person.')) {
                const entity = states[stateKey]
                const { entity_id, attributes } = entity
                if (device_tracker_include && device_tracker_include.length > 0) {
                    if (device_tracker_include.indexOf(entity_id) < 0) {
                        continue;
                    }
                }
                const position = this._getEntityPosition(attributes)
                if (position) {
                    const gcj02_longitude = position.lng
                    const gcj02_latitude = position.lat
                    if (gcj02_longitude != null && gcj02_latitude != null) {
                        const old_gps = this.gpsObj[stateKey]
                        if (old_gps) {
                            if (old_gps.last_updated != entity.last_updated) {
                                has_change = true
                            }
                        } else {
                            has_change = true
                        }
                        this.gpsObj[stateKey] = entity
                        now_gps_list.push(stateKey)
                    }
                }
            }
        }

        for (let zoneKey in this.zoneObj) {
            if (now_zone_list.indexOf(zoneKey) < 0) {
                delete this.zoneObj[zoneKey]
                has_change = true
            }
        }
        for (let gpsKey in this.gpsObj) {
            if (now_gps_list.indexOf(gpsKey) < 0) {
                delete this.gpsObj[gpsKey]
                has_change = true
            }
        }
        if (has_change) {
            that._drawWindow(hass)
            that._drawMap()
        }
    }

    _drawMap(set_center) {
        if (!this.amap) return
        if (this.trajectoryMode) return
        let that = this;
        if (that.zoneEdit) {
            this._drawEditModeMap(set_center)
        } else {
            const allOverlays = that.amap.getAllOverlays()
            if (allOverlays && allOverlays.length > 0) {
                that.amap.remove(allOverlays)
            }
            for (let zoneKey in that.zoneObj) {
                let zone = that.zoneObj[zoneKey]
                const position = this._getEntityPosition(zone.attributes)
                if (!position) {
                    continue
                }
                const gcj02_longitude = position.lng
                const gcj02_latitude = position.lat
                const { friendly_name, radius, dx_polygon } = zone.attributes
                if (gcj02_longitude != null && gcj02_latitude != null) {
                    new AMap.Marker(this._get_marker_options(ZONE, friendly_name, gcj02_longitude, gcj02_latitude))
                }
                if (gcj02_longitude != null && gcj02_latitude != null && dx_polygon) {
                    const polygon_arr = this._transform_polygon_2_array(dx_polygon)
                    if (polygon_arr) {
                        this.amap.add(new AMap.Polygon(this._get_polygon_options(ZONE, polygon_arr)))
                    }
                } else if (gcj02_longitude != null && gcj02_latitude != null && radius >= 0) {
                    new AMap.Circle(this._get_circle_options(ZONE, radius, gcj02_longitude, gcj02_latitude))
                }
            }
            for (let key in that.gpsObj) {
                let gps = that.gpsObj[key]
                const position = this._getEntityPosition(gps.attributes)
                if (!position) {
                    continue
                }
                const gcj02_longitude = position.lng
                const gcj02_latitude = position.lat
                const friendly_name = gps.attributes.friendly_name || gps.entity_id
                if (gcj02_longitude != null && gcj02_latitude != null) {
                    new AMap.Marker(this._get_marker_options(DEVICE_TRACKER, friendly_name, gcj02_longitude, gcj02_latitude))
                }
            }
        }
    }

    _configMap(hass) {
        const that = this;
        let mapContainer = this.shadowRoot.querySelector("#mapContainer");
        if (mapContainer) {
            this.amap = new AMap.Map(mapContainer, {
                center: this._getCenter(hass),
                zoom: 16,
                resizeEnable: true,
                expandZoomRange: true,
                rotateEnable: true,
                pitchEnable: true,
                animateEnable: false,
                jogEnable: false
            });
            // 图层
            this.satelliteLayer = new AMap.TileLayer.Satellite();
            this.roadnetLayer = new AMap.TileLayer.RoadNet()
            this.trafficLayer = new AMap.TileLayer.Traffic()

            // 异步加载插件
            this.amap.plugin(['AMap.Autocomplete', 'AMap.PolyEditor'], function () {
                // 插件加载完成
            });

            // 地图点击事件处理
            this.amap.on('click', function (e) {
                const lng = e.lnglat.lng
                const lat = e.lnglat.lat
                if (that.zoneEdit) {
                    const llInput = that.shadowRoot.querySelector("#ll_input")
                    const polygon_input = that.shadowRoot.querySelector("#polygon_input")
                    const polygon_value = polygon_input?.value
                    if (polygon_value && llInput) {
                        const polygon_array = that._transform_polygon_2_array(polygon_value)
                        if (polygon_array && llInput.value) {
                            const old_llArray = llInput.value.split(",")
                            const old_lng = parseFloat(old_llArray[0])
                            const old_lat = parseFloat(old_llArray[1])
                            const diff_lng = lng - old_lng
                            const diff_lat = lat - old_lat
                            let new_arr = []
                            for (let i = 0; i < polygon_array.length; i++) {
                                const inner_arr = polygon_array[i]
                                new_arr.push((inner_arr[0] + diff_lng).toFixed(6) + "," + (inner_arr[1] + diff_lat).toFixed(6))
                            }
                            if (polygon_input) {
                                polygon_input.value = new_arr.join(';')
                            }
                        }
                    }
                    if (llInput) {
                        llInput.value = lng + "," + lat
                    }
                    that._drawMap()
                } else {
                    const click_ll_span = that.shadowRoot.querySelector("#click_ll_span");
                    if (click_ll_span) {
                        click_ll_span.innerHTML = lng + "," + lat
                        click_ll_span.style.color = random_color[Math.round(Math.random() * (random_color.length - 1))]
                    }
                }
            })
            that._drawMap()
            that._drawWindow(hass)
            this.mapLoading = false;
        }
    }

    _loadMap(hass) {
        if (this.mapLoading) { return }
        this.mapLoading = true
        if (this.amap) {
            this.amap.destroy()
            this.amap = null
            this.satelliteLayer = null
            this.roadnetLayer = null
            this.trafficLayer = null
            this._configMap(hass)
            return;
        }
        let config = this.config
        window._AMapSecurityConfig = {
            securityJsCode: config[CONFIG_GAODE_KEY_SECURITY_CODE],
        }
        AMapLoader.load({
            key: config[CONFIG_GAODE_KEY],
        }).then((AMap) => {
            this._configMap(hass)
        }).catch((e) => {
            console.error(e);
            this.mapLoading = false;
        });
    }

    setConfig(config) {
        if (!config[CONFIG_GAODE_KEY]) {
            throw new Error("请设置高德Key");
        }
        this.config = config;
    }

    _getCenter(hass) {
        let { states } = hass;
        let center = this.config[CONFIG_CENTER]
        // 中心点
        if (center && states[center]) {
            let entity = states[center]
            const position = this._getEntityPosition(entity.attributes)
            if (position) {
                return [position.lng, position.lat]
            }
        }
        return null
    }

    to_datetime_string(date) {
        if (!date) return '';
        var year = date.getFullYear();
        var month = ('0' + (date.getMonth() + 1)).slice(-2);
        var day = ('0' + date.getDate()).slice(-2);
        var hours = ('0' + date.getHours()).slice(-2);
        var minutes = ('0' + date.getMinutes()).slice(-2);
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    _transform_polygon_2_array(polygon) {
        if (!polygon || polygon === '') {
            return null
        }
        const return_arr = []
        const ll_arr = polygon.split(';')
        for (let i = 0; i < ll_arr.length; i++) {
            const ll = ll_arr[i].split(",")
            if (ll.length === 2) {
                return_arr.push([parseFloat(ll[0]), parseFloat(ll[1])])
            }
        }
        return return_arr.length > 0 ? return_arr : null
    }

    disconnectedCallback() {
        if (this.amap) {
            this.amap.destroy()
            this.amap = null
        }
    }
}

customElements.define("dx-gaode-map-card", Ha_gaode);
