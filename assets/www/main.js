let view = {

    state: {
        locations: [
            { value: 'P100', title: 'P100 Panevėžiuko metalai' },
            { value: 'P101', title: 'P101 Gambinaičio sandėlis' },
            { value: 'K100', title: 'K100 Kauno žaliavų sandėlis' },
        ],
    },

    get(id) {
        return document.getElementById(id)
    },

    back() {
        this
        .hide('popup')
        .show('scanner')
        Quagga.start()
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
    },

    accept(e) {
        if (e.keyCode == 13) this.submit()
    },
    
    submit() {
        let item = scanner.lastResult,
        qty = this.get("input").value,
        location = document.querySelector('input[name=stock]:checked').value,
        image = Quagga.canvas.dom.image,
        result = document.createElement('div')
        result.setAttribute('class','thumbnail')
        result.innerHTML = "<img src='"+image.toDataURL()+"'/><h3>"+item+": "+qty+"</h3>"
        this.get('results').prepend(result)
        this.back()
    }
},

scanner = {
    init() {
        Quagga.init(this.state, function(err) {
            if (err) alert(err)
                else Quagga.start()
        })
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

Quagga.onDetected( result => {
    scanner.lastResult = result.codeResult.code
    console.log('Result:', scanner.lastResult)
    Quagga.pause()

    view
    .hide('scanner')
    .show('popup')
    .update({
        input: ''
    })

    setTimeout(() => { 
        view.get("input").focus() 
    }, 500)

    history.pushState(null, null)
})

scanner.init()
