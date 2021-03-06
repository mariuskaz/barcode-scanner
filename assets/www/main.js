let state = {
    
    spreadsheets: [
        { id: 'none', name: 'Inventory' }
    ],

    sheets: [
         { id: 'sheet1', name: 'Sheet1' },
         { id: 'sheet2', name: 'Sheet2' },
         { id: 'sheet3', name: 'Sheet3' }
    ],
    
    ready: false,

},

view = {

    get(id) {
        return document.getElementById(id)
    },

    update(items) {
        for (let id in items) {
            let el = this.get(id),
            data = items[id]
            switch (el.nodeName) {
                case 'INPUT':
                    el.value = data
                    break
                case 'SELECT':
                    el.options.length = 0
                    data.forEach( item => el.options.add(new Option(item.name, item.id)) )
                    break
                case 'DIV':
                    el.innerHTML = data
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

    enable(id) {
        view.get(id).disabled = false
        return this
    },

    accept(e) {
        if (e.keyCode == 13) this.submit()
    },
    
    submit() {
        let item = this.get('item').value,
        qty = this.get('input').value,
        image = Quagga.canvas.dom.image,
        result = document.createElement('div')
        result.setAttribute('class','thumbnail')
        result.innerHTML = "<img src='"+image.toDataURL()+"'/><h3>"+item+": "+qty+"</h3>"
        this.get('results').prepend(result)
        this.back()
    },

    back() {
        history.back()
        this.hide('popup').show('scanner')
        Quagga.start()
    }

},

scanner = {
    init() {
        Quagga.init(this.config, function(err) {
            if (err) alert(err)
                else Quagga.start()
        })
    },

    config: {
        inputStream: {
            type : 'LiveStream',
            constraints: {
                width: 480,
                height: 480,
                facingMode: 'environment',
                aspectRatio: {min: 1, max: 2}
            },

            area: { 
                top: '30%',    // top offset
                right: '10%',  // right offset
                left: '10%',   // left offset
                bottom: '30%'  // bottom offset
            } 
        },

        locator: {
            patchSize: 'large',
            halfSample: true
        },

        numOfWorkers: 2,
        frequency: 10,

        decoder: {
            readers : [{
                format: 'code_128_reader',
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
    console.log('Barcode:', scanner.lastResult)
    Quagga.pause()

    view
    .hide('scanner')
    .show('popup')
    .update({
        item: scanner.lastResult,
        input: ''
    })

    setTimeout(() => { 
        view.get('input').focus() 
    }, 500)

    history.pushState(null, null)
})

scanner.init()
