"use strict";

/*
    
    TilesView_styling
    
*/

(class TilesView_styling extends TilesView {
    
    setTileBackgroundColor (aColor) {
        this.tileStyles().unselected().setBackgroundColor(aColor)
        return this
    }

    setTileSelectionColor (aColor) {
        this.tileStyles().selected().setBackgroundColor(aColor)
        return this
    }

    applyStyles () {
        //this.debugLog(".applyStyles()")
        super.applyStyles()
        return this
    }

    /*
    darkenUnselectedTiles () {
        const darkenOpacity = 0.5
        this.tiles().forEach(tile => {
            if (tile.isSelected()) {
                tile.setOpacity(1)
            } else {
                tile.setOpacity(darkenOpacity)
            }
        })
        return this
    }

    undarkenAllTiles () {
        this.tiles().forEach((tile) => {
            tile.setOpacity(1)
        })
    }
    */

}.initThisCategory());
