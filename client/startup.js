Meteor.startup(function() {
    jQuery.Velocity.RegisterEffect("callout.oj_flash", {
        defaultDuration: 3000,
        calls: [
            [ { scaleX: 1.5, scaleY: 1.5, colorGreen: "60%", paddingRight: "1em", fontWeight: '200' }, 0.15 ],
            [ { scaleX: 1.1,   scaleY: 1.1, colorGreen: "40%", paddingRight: "5px", fontWeight: '400' }, 0.25 ],
            [ { scaleX: 1.9, scaleY: 1.9, colorGreen: "70%", paddingRight: "1.4em", fontWeight: '600' }, 0.25 ],
            [ { scaleX: 1.1,   scaleY: 1.1, colorGreen: "40%", paddingRight: "5px", fontWeight: '800' }, 0.35 ]
        ]
    });
    jQuery.Velocity.RegisterEffect("callout.oj_animate_arrow", {
        defaultDuration: 1000,
        calls: [
            [ { top: "+0.3em" }, 0.30 ],
            [ { top: 0 }, 0.05 ],
            [ { top: "+0.5em" }, 0.60 ],
            [ { top: 0 }, 0.05 ]
        ]
    });
});
