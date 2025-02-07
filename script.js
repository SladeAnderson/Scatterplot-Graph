class Racer {
    Time = 0;
    Place = 0;
    Seconds = 0;
    Name = "";
    Year = 0;
    Nationality = "";
    Doping = "";
    URL = "";
}


const xhr = new XMLHttpRequest();
xhr.open('GET',"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json",true)
xhr.send();
xhr.onload = () => {
    if(xhr.status == 200) {
        drawScatterPlot(xhr.response);
    }
}

/**
 * Draws a scatter plot using the provided data.
 *
 * @param {Racer[]} Data - A JSON string representing the data to be plotted. Each data point should have the following properties:
 *   - Year: The year of the data point.
 *   - Month: The month of the data point (1-12).
 *   - Date: The date of the data point in a format that can be parsed by JavaScript's Date object.
 */
function drawScatterPlot(Data) {
    const data = JSON.parse(Data);

    console.log(data);

    const width = 800;
    const height = 400;
    const padding = 40;

    const svg = d3.select('#scatterplot')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('class', 'graph');

    svg.append('text')
        .attr("id", "title")
        .attr('x', width / 2)
        .attr('y', padding)
        .attr('text-anchor', 'middle')
        .text("Doping in Professional Bicycle Racing");
    
    // creating the scales

    const xScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.Year), d3.max(data, d => d.Year)])
        .range([padding, width - padding]);

    const yScale = d3.scaleTime()
        .domain([d3.max(data, d => new Date(d.Seconds * 1000)), d3.min(data, d => new Date(d.Seconds * 1000))])
        .range([height - padding, padding]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

    // -----------------------------------

    // rendering the scatter plot

    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', d => xScale(d.Year))
        .attr('cy', d => yScale(new Date(d.Seconds * 1000)))
        .attr('r', 5)
        .attr('data-xvalue', d => d.Year)
        .attr('data-yvalue', d => new Date(d.Seconds * 1000))
        .attr('fill', d => d.Doping ? '#B22222' : '#4682B4')
        .on('mouseover', (event, d) => {
            const tooltip = d3.select('#tooltip');
            tooltip.transition()
                .duration(200)
                .style('opacity', 1);
            tooltip.html(`${d.Name}: ${d.Nationality}<br>Year: ${d.Year}, Time: ${d.Time}<br>${d.Doping ? d.Doping : 'No Doping Allegations'}`)
                .attr('data-year', d.Year)
                .style('left', (event.pageX + 5) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', () => {
            d3.select('#tooltip').transition()
                .duration(500)
                .style('opacity', 0);
        })
        .on('click', (event, d) => {
            window.open(d.URL);
        });





    // adding the axis's

    svg.append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(0, ${height - padding})`)
        .call(xAxis);

    svg.append('g')
        .attr('id', 'y-axis')
        .attr('transform', `translate(${padding}, 0)`)
        .call(yAxis);    
}

