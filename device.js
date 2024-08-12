const isAppleDeviceOrSafari = () => {
    const userAgent = navigator.userAgent.toLowerCase()
    const isSafari = userAgent.includes('safari') && !userAgent.includes('chrome')
    const isAppleDevice = /iphone|ipad|ipod|macintosh|mac os x/.test(userAgent)
    const isAppleSilicon = /macintosh.+(apple|arm)/.test(userAgent)
    return isSafari || isAppleDevice || isAppleSilicon
}

if (isAppleDeviceOrSafari()) {
    document.write('<div class="container"> <object class="internal" type="text/html" data="js/index.html" ></object> </div>')
} else {
    document.write('<div class="container"> <object class="internal" type="text/html" data="wasmJs/index.html" ></object> </div>')
}