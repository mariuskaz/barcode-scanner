let view = {

    state: {
        stocks: [
            { value: 'P100', title: 'P100 Panevėžiuko metalai' },
            { value: 'P101', title: 'P101 Gambinaičio sandėlis' },
            { value: 'K100', title: 'K100 Kauno žaliavų sandėlis' },
        ],
    },

    get(id) {
        return document.getElementById(id)
    },

    back() {
        history.back()
    },

    update(data) {
        for (let id in data) {
            let el = this.get(id)
            switch (el.nodeName) {
                case 'INPUT':
                    el.value = data[id]
                    break
                case 'DIV':
                    el.innerHTML = data[id]
            }
        }
    },

    show(id) {
        this.get(id).style.display = 'inline'
        return this
    },

    hide(id) {
        this.get(id).style.display = 'none'
        return this
    }
},

resultCollector = Quagga.ResultCollector.create({
    capture: true,
    capacity: 20,
    blacklist: [
        { code: "WIWV8ETQZ1", format: "code_93" }, 
        { code: "EH3C-%GU23RK3", format: "code_93" }, 
        { code: "O308SIHQOXN5SA/PJ", format: "code_93" }, 
        { code: "DG7Q$TV8JQ/EN", format: "code_93" }, 
        { code: "VOFD1DB5A.1F6QU", format: "code_93" }, 
        { code: "4SO64P4X8 U4YUU1T-", format: "code_93" }
    ],
    filter: function(codeResult) {
        // only store results which match this constraint
        // e.g.: codeResult
        return true;
    }
}),

scanner = {
    init() {
        let self = this
        Quagga.init(this.state, function(err) {
            if (err) return self.handleError(err)
            scanner.attachListeners()
            scanner.checkCapabilities()
            Quagga.start()
        })
    },

    handleError(err) {
        alert(err)
    },

    checkCapabilities() {
        let track = Quagga.CameraAccess.getActiveTrack(),
        capabilities = {}
        if (typeof track.getCapabilities === 'function') {
            capabilities = track.getCapabilities()
        }
        //this.applySettingsVisibility('zoom', capabilities.zoom)
        //this.applySettingsVisibility('torch', capabilities.torch)
    },

    attachListeners() {
        var self = this;
        //self.initCameraSelection();
    },

    _printCollectedResults() {
        var results = resultCollector.getResults(),
            $ul = $("#result_strip ul.collector");

        results.forEach(function(result) {
            var $li = $('<li><div class="thumbnail"><div class="imgWrapper"><img /></div><div class="caption"><h4 class="code"></h4></div></div></li>');

            $li.find("img").attr("src", result.frame);
            $li.find("h4.code").html(result.codeResult.code + " (" + result.codeResult.format + ")");
            $ul.prepend($li);
        });
    },

    _accessByPath(obj, path, val) {
        var parts = path.split('.'),
            depth = parts.length,
            setter = (typeof val !== "undefined") ? true : false;

        return parts.reduce(function(o, key, i) {
            if (setter && (i + 1) === depth) {
                if (typeof o[key] === "object" && typeof val === "object") {
                    Object.assign(o[key], val);
                } else {
                    o[key] = val;
                }
            }
            return key in o ? o[key] : {};
        }, obj);
    },

    _convertNameToState(name) {
        return name.replace("_", ".").split("-").reduce(function(result, value) {
            return result + value.charAt(0).toUpperCase() + value.substring(1);
        });
    },

    detachListeners() {
        //$(".controls").off("click", "button.stop");
        //$(".controls .reader-config-group").off("change", "input, select");
    },

    applySetting(setting, value) {
        var track = Quagga.CameraAccess.getActiveTrack();
        if (track && typeof track.getCapabilities === 'function') {
            switch (setting) {
            case 'zoom':
                return track.applyConstraints({advanced: [{zoom: parseFloat(value)}]});
            case 'torch':
                return track.applyConstraints({advanced: [{torch: !!value}]});
            }
        }
    },

    state: {
        inputStream: {
            type : "LiveStream",
            constraints: {
                width: 480,
                height: 480,
                facingMode: "environment",
                aspectRatio: {min: 1, max: 2}
            }

            /* defines rectangle of the detection/localization area */
            ,area: { 
                top: "30%",    // top offset
                right: "10%",  // right offset
                left: "10%",   // left offset
                bottom: "30%"  // bottom offset
            } 
        },
        locator: {
            patchSize: "large",
            halfSample: true
        },
        numOfWorkers: 2,
        frequency: 10,
        decoder: {
            readers : [{
                format: "code_128_reader",
                config: {}
            }],
            multiple: false
        },
        locate: true,
        multiple: false
    },

    lastResult: null
}

scanner.init()

Quagga.onDetected( result => {
    let code = result.codeResult.code
    console.log(code)
    Quagga.pause()
    scanner.lastResult = code
    view.hide('scanner').show('popup')
    view.update({ 
        item: 'NV: '+code,
        input: ''
    })
    setTimeout(() => { 
        view.get("input").focus() 
    }, 500)
    history.pushState(null, null)
})

function onEnter(e) {
    console.log(e.keyCode)
    if (e.keyCode == 13) accept()
}

function accept() {
    let qty = view.get("input").value,
    stock = document.querySelector('input[name=stock]:checked').value,
    canvas = Quagga.canvas.dom.image,
    item = document.createElement("div")
    item.setAttribute('class','thumbnail')
    item.innerHTML = "<img src='"+canvas.toDataURL()+"'/><h3>"+scanner.lastResult+": "+qty+"</h3>"
    view.get('results').prepend(item)
    view.hide('popup').show('scanner')
    Quagga.start()
    view.back()
}
       