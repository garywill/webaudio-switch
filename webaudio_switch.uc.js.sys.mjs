/* Firefox userChrome script
 * Tested on Firefox 140
 * Author: garywill (https://garywill.github.io)
 * 
 */


console.debug("webaudio_switch.uc.js");

(() => {
    
    // -------------------------------------------------------------------------------------
    const prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
    const pref_waenable = prefs.getBranch( "dom.webaudio.enabled" );
    
    const { CustomizableUI } = ChromeUtils.importESModule("resource:///modules/CustomizableUI.sys.mjs");
    const Services = globalThis.Services || ChromeUtils.import("resource://gre/modules/Services.jsm").Services; 
    const sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
    // ---------------------------------------------------------------------------------------
    
    const widgetBtnId = "uc-wa-button";
    const button_label = "WebAudio Switch";
    const cssuri_wabutton_icon = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(`
            toolbarbutton#${widgetBtnId} .toolbarbutton-icon {
                list-style-image: url("chrome://global/skin/media/audioNoAudioButton.svg");
            }`), null, null);

    
    const cssuri_wabutton_green = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(`
            toolbarbutton#${widgetBtnId} .toolbarbutton-icon {
                fill: green ; 
            }
            toolbarbutton#${widgetBtnId} .toolbarbutton-badge {
                background-color: #009f00;
                display: none; 
            }
            toolbarbutton#${widgetBtnId} .toolbarbutton-badge::before {
                content: ''; 
            }
            `), null, null);
    const cssuri_wabutton_orange = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(`
            toolbarbutton#${widgetBtnId} .toolbarbutton-icon {
                fill: #FF8C00; 
            }
            toolbarbutton#${widgetBtnId} .toolbarbutton-badge {
                background-color: red;
            }
            toolbarbutton#${widgetBtnId} .toolbarbutton-badge::before {
                content: ''; 
            }
            `), null, null);
    
    
    CustomizableUI.createWidget({
        type: "custom", 
        id: widgetBtnId, // button id
        defaultArea: CustomizableUI.AREA_NAVBAR,
        removable: true,
        onBuild: function (doc) {
            let btn = doc.createXULElement('toolbarbutton');
            btn.id = widgetBtnId;
            btn.label = button_label;
            btn.tooltipText = button_label;
            btn.type = 'menu';
            btn.className = 'toolbarbutton-1 chromeclass-toolbar-additional';
            btn.setAttribute("badged", "true"); 
            btn.setAttribute("badge", "!"); 
            
            btn.onclick = function(event) {
                toggleWa();
            }; 
            
            return btn;
        }, 

    });
    
    sss.loadAndRegisterSheet(cssuri_wabutton_icon, sss.USER_SHEET);
    
    update_wabutton_icon();
    
    pref_waenable.addObserver("", update_wabutton_icon, false);
    
    function getWaVal(){
        return pref_waenable.getBoolPref("");
    }
    function setWaVal(val){
        pref_waenable.setBoolPref("", val);
        update_wabutton_icon();
    }
    function toggleWa(){
        setWaVal(!getWaVal())
    }
    
    function update_wabutton_icon(){
 
        const val = getWaVal();
        
        sss.unregisterSheet(cssuri_wabutton_green, sss.USER_SHEET);
        sss.unregisterSheet(cssuri_wabutton_orange, sss.USER_SHEET);

        if (val)
            sss.loadAndRegisterSheet(cssuri_wabutton_orange, sss.USER_SHEET);
        else 
            sss.loadAndRegisterSheet(cssuri_wabutton_green, sss.USER_SHEET);
    }
    
})();
    
// CustomizableUI.destroyWidget("uc-wa-button");
