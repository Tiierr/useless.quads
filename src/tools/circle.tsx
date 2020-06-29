import Quad from "./quad";

export default function Circle(svg: any, quads: null | Quad[], init: boolean) {
    var circle = svg.selectAll('.a').data(quads)
        .enter().append('circle');

    if (init) {
        // Setup the initial state of the initial circle
        circle = circle
            .attr('cx',   function(d: Quad) { return d.x + d.w / 2 ; })
            .attr('cy',   function(d: Quad) { return d.y + d.h / 2; })
            .attr('r', function(d: Quad) { return d.w / 1000; })
            .attr('fill', '#fff')
            .transition()
            .duration(1000);
    } else {
        // Setup the initial state of the opened circles
        circle = circle
            .attr('cx',   function(d: Quad) { return d.parent ? d.parent.x + d.parent.w / 2 : 0; })
            .attr('cy',   function(d: Quad) { return d.parent ? d.parent.y + d.parent.h / 2 : 0; })
            .attr('r',    function(d: Quad) { return d.parent ? d.parent.w / 2 : 0; })
            .attr('fill', function(d: Quad) { return d.color ; })
            .attr('fill-opacity', 0.18)
            .transition()
            .duration(250);
    }

    // Transition the to the respective final state
    circle
        .attr('cx',   function(d: Quad) { return d.x + d.w / 2; })
        .attr('cy',   function(d: Quad) { return d.y + d.h / 2; })
        .attr('r',    function(d: Quad) { return d.w / 2; })
        .attr('fill', function(d: Quad) { return d.color; })
        .attr('fill-opacity', 1)
        .each(function(d: Quad) {
            // @ts-ignore
            d.node = this;
        });
}
