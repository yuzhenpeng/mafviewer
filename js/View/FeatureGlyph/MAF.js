define([
    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/_base/lang',
    'JBrowse/View/FeatureGlyph/Box'
],
function (
    declare,
    array,
    lang,
    FeatureGlyph
) {
    return declare(FeatureGlyph, {
        getColor: function (type) {
            return this.getConf('style.color', [type]);
        },
        renderFeature: function (context, fRect) {
            var feature = fRect.f;
            var block = fRect.viewInfo.block;
            var scale = fRect.viewInfo.scale;
            var charSize = this.getCharacterMeasurements( context );
            var s = feature.get('start');
            var h = this.config.style.height;
            var vals = feature.get('alignments');
            var seq = feature.get('seq');
            r = false;
            if(scale >= 20) {
                r = true;
            }
            

            for(var j = 0; j < this.config.samples.length; j++) {
                var key = this.config.samples[j];
                if (vals[key]) {
                    var pos = j;
                    var alignment = vals[key].data;

                    var left = fRect.viewInfo.block.bpToX(s);
                    var right = fRect.viewInfo.block.bpToX(s + 1);
                    var delta = right - left;

                    //gaps
                    context.fillStyle = this.config.style.gapColor;
                    for (var i = 0; i < alignment.length; i++) {
                        var l = left + delta*i;
                        if (alignment[i] === '-') {
                            context.fillRect(l, 3 / 8 * h + h * pos, delta + 0.6, h / 4);
                        }
                    }
                    //mismatches
                    context.fillStyle = this.config.style.mismatchColor;
                    for (var i = 0; i < alignment.length; i++) {
                        var l = left + delta*i;
                        if (seq[i].toLowerCase() !== alignment[i].toLowerCase() && alignment[i] !== '-') {
                            context.fillRect(l, 1 / 4 * h + h * pos, delta + 0.6, h / 2);
                        }
                    }
                    //matches
                    context.fillStyle = this.config.style.matchColor;
                    for (var i = 0; i < alignment.length; i++) {
                        var l = left + delta*i;
                        if (seq[i].toLowerCase() === alignment[i].toLowerCase()) {
                            context.fillRect(l, 1 / 4 * h + h * pos, delta + 0.6, h / 2);
                        }
                        
                    }
                    //font
                    context.font = this.config.style.mismatchFont;
                    context.fillStyle = 'white';
                    for (var i = 0; i < alignment.length; i++) {
                        var l = left + delta*i;
                        if( delta >= charSize.w) {
                            var offset = (delta-charSize.w)/2+1
                            context.fillText( alignment[i], l+offset, h/2+h*pos+2, delta + 0.6, h/2)
                        }
                    }
                }
            }
            return 0;
        },
        _defaultConfig: function() {
            return this._mergeConfigs(dojo.clone(this.inherited(arguments)), {
                style: {
                    mismatchFont: 'bold 10px Courier New,monospace'
                }
            });
        },

        getCharacterMeasurements: function( context ) {
            return this.charSize = this.charSize || function() {
                var fpx;

                try {
                    fpx = (this.config.style.mismatchFont.match(/(\d+)px/i)||[])[1];
                } catch(e) {}

                fpx = fpx || Infinity;
                return { w: fpx, h: fpx };
            }.call(this);
        }
    });
});

