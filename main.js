/* jshint esversion: 6 */
let finalize;

const dataPromise = Promise.all([
  fetch("science-map.vl.json").then((r) => r.json()),
  fetch('data/combined-nodes.json').then(r => r.json()),
  fetch('data/combined-edges.json').then(r => r.json())
]);

function updateData() {
  if (finalize) {
    finalize();
    document.getElementById('visualization').innerHTML = '<em class="loading">Loading...</em>';
  }
  const sourceSelector = document.getElementById('source');
  // sourceSelector.disabled = true;
  setTimeout(() => {
    dataPromise.then(([spec, nodes, edges]) => {
      // const src = sourceSelector.value;
      let src = projectToData[decodeURIComponent(location.hash.substring(1).toLowerCase())].dataName
      console.log(src)
      if (src !== 'All Six') {
        nodes = nodes.filter(n => n.src === src);
        edges = edges.filter(n => n.src === src);
      }
      spec.datasets.nodes = nodes;
      spec.datasets.edges = edges;
      document.getElementById('visualization').innerHTML = '';
      
      return vegaEmbed("#visualization", spec, { "renderer": "png", "actions": true });
    }).then((results) => {
      finalize = results.finalize;
      // sourceSelector.disabled = false;
      element = document.createElement("div")
      element.className+=" question"
      element.innerHTML = "?"
      document.getElementById('visualization').appendChild(element)

      d3.select(element).on("click", function(event, d) {
        if(d3.select("#helpscreen").style("display")=="none"){
          d3.select("#helpscreen").style("display",null);
          d3.select(element).style("display","none");
        }else{
          d3.select("#helpscreen").style("display","none");
          d3.select(element).style("display",null);
        }
      });
      d3.select("#helpscreen").on("click", function(event, d) {
        d3.select("#helpscreen").style("display","none");
        d3.select(element).style("display",null);
        
      });
      console.log("Visualization successfully loaded");
    });
  }, 50);
}

let projectToData = {
  "combined":{
    name:"All Six",
    dataName:"All Six",
    mapColor:"#BBB2B6",
    color:"#AAAAAA"
  },
  "atlas":{
    name:"ATLAS",
    dataName:"ATLAS",
    mapColor:"#BBB2B6",
    color:"#CC006B"
  },
  "babar":{
    name:"BaBar",
    dataName:"BaBar",
    mapColor:"#B1C3B6",
    color:"#008758"
  },
  "ligo":{
    name:"LIGO",
    dataName:"LIGO",
    mapColor:"#B1A58C",
    color:"#903C22"
  },
  "icecube":{
    name:"IceCube",
    dataName:"IceCube",
    mapColor:"#AFB9C9",
    color:"#1E6099"
  },
  "hgp":{
    name:"HGP",
    dataName:"HGP",
    mapColor:"#AFB9C9",
    color:"#DB5921"
  },
  "hubmap+hca":{
    name:"HuBMAP & HCA",
    dataName:"HuBMAP+HCA",
    mapColor:"#AFB9C9",
    color:"#CC0A21"
  },
}

let projectsOrder = ["combined","atlas","babar","ligo","icecube","hgp","hubmap+hca"];

d3.select("#selectionmenu")
  .selectAll("a")
  .data(projectsOrder)
  .enter()
  .append("a")
  .attr("href",d=>"#"+d)
  .style("--color",d=>projectToData[d].color)
  .append("span")
  .text(d=>projectToData[d].name);


function locationHashChanged() {
  let projectCode = decodeURIComponent(location.hash.substring(1).toLowerCase());
  let projectData = projectToData[projectCode];
  d3.selectAll("#selectionmenu")
  .selectAll("a")
  .classed("selected",d=>d.toLowerCase()==projectCode);
  
  // window.heliosMap = new HeliosMap({
  //   elementID: "netviz",
  //   projectName: projectData.name,
  //   mapColor: projectData.mapColor,
  //   projectColor: projectData.color
  // });
  updateData()
}

window.addEventListener('hashchange', locationHashChanged);


if(!window.location.hash){
  window.location.hash = "#combined";
}else{
  // updateData();
}

locationHashChanged()
