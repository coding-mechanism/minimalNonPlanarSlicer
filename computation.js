const compute = {

        stlObject:{},
        buildPlate: {},
        importSTL(event){
            for(let i =0; i< event.target.files.length; i++){
                compute.fileInputChange(event.target.files[i]);
            }
        },
        loadDemoSTL(){
                let stlObject = state.demoSTL;
                state.objects.set(stlObject.id, stlObject);
                state.selectedId = stlObject.id;
                slicerApp.selectNode(stlObject, 'object', stlObject);
                if(state.buildPlate.originCenter == 'corner'){
                    for(let i = 0; i < stlObject.planarScaffold.origTriangles.length; i++){
                        stlObject.planarScaffold.origTriangles[i].vertices[0].x += state.buildPlate.buildPlateOrbitCenterOffset.x;
                        stlObject.planarScaffold.origTriangles[i].vertices[0].y += state.buildPlate.buildPlateOrbitCenterOffset.y;
                        stlObject.planarScaffold.origTriangles[i].vertices[0].z += state.buildPlate.buildPlateOrbitCenterOffset.z;
                        stlObject.planarScaffold.origTriangles[i].vertices[1].x += state.buildPlate.buildPlateOrbitCenterOffset.x;
                        stlObject.planarScaffold.origTriangles[i].vertices[1].y += state.buildPlate.buildPlateOrbitCenterOffset.y;
                        stlObject.planarScaffold.origTriangles[i].vertices[1].z += state.buildPlate.buildPlateOrbitCenterOffset.z;
                        stlObject.planarScaffold.origTriangles[i].vertices[2].x += state.buildPlate.buildPlateOrbitCenterOffset.x;
                        stlObject.planarScaffold.origTriangles[i].vertices[2].y += state.buildPlate.buildPlateOrbitCenterOffset.y;
                        stlObject.planarScaffold.origTriangles[i].vertices[2].z += state.buildPlate.buildPlateOrbitCenterOffset.z;
                    }
                }
                 else {
                    for(let i = 0; i < stlObject.planarScaffold.origTriangles.length; i++){
                        stlObject.planarScaffold.origTriangles[i].vertices[0].x += state.buildPlate.buildPlateOrbitCenter.x;
                        stlObject.planarScaffold.origTriangles[i].vertices[0].y += state.buildPlate.buildPlateOrbitCenter.y;
                        stlObject.planarScaffold.origTriangles[i].vertices[0].z += state.buildPlate.buildPlateOrbitCenter.z;
                        stlObject.planarScaffold.origTriangles[i].vertices[1].x += state.buildPlate.buildPlateOrbitCenter.x;
                        stlObject.planarScaffold.origTriangles[i].vertices[1].y += state.buildPlate.buildPlateOrbitCenter.y;
                        stlObject.planarScaffold.origTriangles[i].vertices[1].z += state.buildPlate.buildPlateOrbitCenter.z;
                        stlObject.planarScaffold.origTriangles[i].vertices[2].x += state.buildPlate.buildPlateOrbitCenter.x;
                        stlObject.planarScaffold.origTriangles[i].vertices[2].y += state.buildPlate.buildPlateOrbitCenter.y;
                        stlObject.planarScaffold.origTriangles[i].vertices[2].z += state.buildPlate.buildPlateOrbitCenter.z;
                    }
                };

                compute.rotateView(state.buildPlate.xAngle, state.buildPlate.yAngle, state.buildPlate.zAngle);
                slicerApp.renderSidebar();
        },

        fileInputChange(stl){
            const reader = new FileReader();
            if(stl.type !== "model/stl"){
                return false;
            }
            reader.readAsArrayBuffer(stl);
            reader.onload = (() => {
            return function(e) {
                let stlObject = new StlObject(e.target.result);
                stlObject.id = stl.name;
                stlObject.name = stl.name;
                if(state.objects.has(stlObject.id)){
                    let newId = stlObject.id.split(".");
                    let count = newId[1].match(/[0-9]+/);
                    let id = '';
                    if(!count){
                        count = 0;
                    }
                    for(let i = 1; i <= state.objects.size; i++){
                        id = `${newId[0]}.${newId[1]} (${count+i})`;
                        if(!state.objects.has(id)){
                            break;
                        }
                    }
                    stlObject.id = id;
                    stlObject.name = id;
                }
                state.objects.set(stlObject.id, stlObject);
                state.selectedId = stlObject.id;
                slicerApp.selectNode(stlObject, 'object', stlObject);
                if(state.buildPlate.originCenter == 'corner'){
                    for(let i = 0; i < stlObject.planarScaffold.origTriangles.length; i++){
                        stlObject.planarScaffold.origTriangles[i].vertices[0].x += state.buildPlate.buildPlateOrbitCenterOffset.x;
                        stlObject.planarScaffold.origTriangles[i].vertices[0].y += state.buildPlate.buildPlateOrbitCenterOffset.y;
                        stlObject.planarScaffold.origTriangles[i].vertices[0].z += state.buildPlate.buildPlateOrbitCenterOffset.z;
                        stlObject.planarScaffold.origTriangles[i].vertices[1].x += state.buildPlate.buildPlateOrbitCenterOffset.x;
                        stlObject.planarScaffold.origTriangles[i].vertices[1].y += state.buildPlate.buildPlateOrbitCenterOffset.y;
                        stlObject.planarScaffold.origTriangles[i].vertices[1].z += state.buildPlate.buildPlateOrbitCenterOffset.z;
                        stlObject.planarScaffold.origTriangles[i].vertices[2].x += state.buildPlate.buildPlateOrbitCenterOffset.x;
                        stlObject.planarScaffold.origTriangles[i].vertices[2].y += state.buildPlate.buildPlateOrbitCenterOffset.y;
                        stlObject.planarScaffold.origTriangles[i].vertices[2].z += state.buildPlate.buildPlateOrbitCenterOffset.z;
                    }
                }
                 else {
                    for(let i = 0; i < stlObject.planarScaffold.origTriangles.length; i++){
                        stlObject.planarScaffold.origTriangles[i].vertices[0].x += state.buildPlate.buildPlateOrbitCenter.x;
                        stlObject.planarScaffold.origTriangles[i].vertices[0].y += state.buildPlate.buildPlateOrbitCenter.y;
                        stlObject.planarScaffold.origTriangles[i].vertices[0].z += state.buildPlate.buildPlateOrbitCenter.z;
                        stlObject.planarScaffold.origTriangles[i].vertices[1].x += state.buildPlate.buildPlateOrbitCenter.x;
                        stlObject.planarScaffold.origTriangles[i].vertices[1].y += state.buildPlate.buildPlateOrbitCenter.y;
                        stlObject.planarScaffold.origTriangles[i].vertices[1].z += state.buildPlate.buildPlateOrbitCenter.z;
                        stlObject.planarScaffold.origTriangles[i].vertices[2].x += state.buildPlate.buildPlateOrbitCenter.x;
                        stlObject.planarScaffold.origTriangles[i].vertices[2].y += state.buildPlate.buildPlateOrbitCenter.y;
                        stlObject.planarScaffold.origTriangles[i].vertices[2].z += state.buildPlate.buildPlateOrbitCenter.z;
                    }
                };

                compute.rotateView(state.buildPlate.xAngle, state.buildPlate.yAngle, state.buildPlate.zAngle);
                slicerApp.renderSidebar();
                //                slicerApp.drawViewport();
//                let canvas = document.getElementById("viewport");
//                canvas.width = canvas.width;
//                state.buildPlate.drawSegmentsToCanvas(state.buildPlate.rotSegments);
                // let bb = findBoundingBox(planarScaffold.origTriangles);
                // bb = bb[bb.length -1];
                // planarScaffold.xShift = (((bb.xMax-bb.xMin)/2) + bb.xMin)*-1;
                // planarScaffold.yShift = (((bb.yMax-bb.yMin)/2)+bb.yMin)*-1;
                // planarScaffold.zShift =  bb.zMin*-1;
                // translateStl(planarScaffold.triangles, planarScaffold.triangles, planarScaffold.xShift, planarScaffold.yShift, planarScaffold.zShift);
                // translateStl(planarScaffold.origTriangles, planarScaffold.origTriangles, planarScaffold.xShift, planarScaffold.yShift, planarScaffold.zShift);
                // rotateSTL(planarScaffold.triangles, planarScaffold.triangles, buildPlate.xAngle, buildPlate.yAngle, buildPlate.zAngle);
                // planarScaffold.xShift = 0;
                // planarScaffold.yShift = 0;
                // planarScaffold.zShift = 0;
                // planarScaffold.zMin = bb.zMin;
// 
                // let nonPlanarTopSurface = {origTriangles: [], triangles: [], xShift: 0, yShift: 0, zShift: 0, xAngle: 0, yAngle: 0, zAngle: 0};
                // for(let i = 0; i < planarScaffold.triangles.length; i++){
                    // let ot = [];
                    // let t = [];
                    // for(let j = 0; j < 3; j++){
                        // ot.push(structuredClone(planarScaffold.origTriangles[i].vertices[j]));
                        // t.push(structuredClone(planarScaffold.triangles[i].vertices[j]));
                    // }
                    // nonPlanarTopSurface.origTriangles.push({vertices: ot, normal: {normalX: planarScaffold.origTriangles[i].normal.normalX, normalY: planarScaffold.origTriangles[i].normal.normalY, normalZ: planarScaffold.origTriangles[i].normal.normalZ}});
                    // nonPlanarTopSurface.triangles.push({vertices: t, normal:{normalX: planarScaffold.triangles[i].normal.normalX, normalY: planarScaffold.triangles[i].normal.normalY, normalZ: planarScaffold.triangles[i].normal.normalZ}});
                // }
                // files[0].stl.fileData.nonPlanarTopSurface = nonPlanarTopSurface;
                // let xShift = parseFloat(document.getElementById("xTranslationInputNonPlanarId").value);
                // let yShift = parseFloat(document.getElementById("yTranslationInputNonPlanarId").value);
                // let zShift = parseFloat(document.getElementById("zTranslationInputNonPlanarId").value);
                // nonPlanarTopSurface.xShift = xShift;
                // nonPlanarTopSurface.yShift = yShift;
                // nonPlanarTopSurface.zShift = zShift;
                // stlObject.planarScaffold = planarScaffold;
                // stlObject.nonPlanarTopSurface = nonPlanarTopSurface;
                // updateCanvas();
            };
        })();
        },

        clickFileInput(){
            document.getElementById("fileInputId").click();
        },

        onElementResize(elements){
            for(const element of elements){
                if(element.target.id == "canvasContainerId"){
                    canvasChange(element.contentRect);
                }
            }
        },

        canvasInputChange(event){
            let canvasContainer = document.getElementById("canvasContainerId");
            if(event.target.id == "canvasWidthInput"){
                canvasContainer.style.width = event.target.value + "px";
            }
            if(event.target.id == "canvasHeightInput"){
                canvasContainer.style.height = event.target.value + "px";
                
            }
        },

        canvasChange(size){
            let canvas = document.getElementById("canvasContainerId");
            let canvasInputWidth = document.getElementById("canvasWidthInput");
            let canvasInputHeight = document.getElementById("canvasHeightInput");
            canvasInputWidth.value = size.width;
            canvasInputHeight.value = size.height;
        },

        drawTrianglesToCanvas(triangles, color){
            let canvas = document.getElementById("viewport");

            let canvasCtx = canvas.getContext("2d");
            canvasCtx.strokeStyle = color;
            for(let i = 0; i < triangles.length; i++){
                canvasCtx.beginPath();
                canvasCtx.moveTo(((triangles[i].vertices[0].x)* state.buildPlate.scaleFactor)+ state.buildPlate.xShift , ((triangles[i].vertices[0].y)* state.buildPlate.scaleFactor)+state.buildPlate.yShift);
                canvasCtx.lineTo(((triangles[i].vertices[1].x)* state.buildPlate.scaleFactor)+ state.buildPlate.xShift , ((triangles[i].vertices[1].y)* state.buildPlate.scaleFactor)+state.buildPlate.yShift);
                canvasCtx.lineTo(((triangles[i].vertices[2].x)* state.buildPlate.scaleFactor)+ state.buildPlate.xShift , ((triangles[i].vertices[2].y)* state.buildPlate.scaleFactor)+state.buildPlate.yShift);
                canvasCtx.lineTo(((triangles[i].vertices[0].x)* state.buildPlate.scaleFactor)+ state.buildPlate.xShift , ((triangles[i].vertices[0].y)* state.buildPlate.scaleFactor)+state.buildPlate.yShift);
                canvasCtx.closePath();
                canvasCtx.stroke();
            }            
        },

        drawTrianglesToCanvasFilled(triangles, fillColor, edgeColor){
            let canvas = document.getElementById("viewport");
            let canvasCtx = canvas.getContext("2d");
            canvasCtx.strokeStyle = edgeColor;
            canvasCtx.fillStyle = fillColor;
            for(let i = 0; i < triangles.length; i++){
                canvasCtx.beginPath();
                canvasCtx.moveTo(((triangles[i].vertices[0].x)* state.buildPlate.scaleFactor)+ state.buildPlate.xShift , ((triangles[i].vertices[0].y)* state.buildPlate.scaleFactor)+state.buildPlate.yShift);
                canvasCtx.lineTo(((triangles[i].vertices[1].x)* state.buildPlate.scaleFactor)+ state.buildPlate.xShift , ((triangles[i].vertices[1].y)* state.buildPlate.scaleFactor)+state.buildPlate.yShift);
                canvasCtx.lineTo(((triangles[i].vertices[2].x)* state.buildPlate.scaleFactor)+ state.buildPlate.xShift , ((triangles[i].vertices[2].y)* state.buildPlate.scaleFactor)+state.buildPlate.yShift);
                canvasCtx.lineTo(((triangles[i].vertices[0].x)* state.buildPlate.scaleFactor)+ state.buildPlate.xShift , ((triangles[i].vertices[0].y)* state.buildPlate.scaleFactor)+state.buildPlate.yShift);
                canvasCtx.closePath();
                canvasCtx.stroke();
                canvasCtx.fill();
            }
        },
        
        addTrianglesToCanvas(triangles, scaleFactor){
            let canvas = document.getElementById("viewport");
            let canvasCtx = canvas.getContext("2d");
            canvasCtx.beginPath();
            canvasCtx.strokeStyle = "#00ff00";            
            for(let i = 0; i < triangles.length; i++){
                canvasCtx.beginPath();
                canvasCtx.moveTo(((triangles[i].vertices[0].x)* scaleFactor) , ((triangles[i].vertices[0].y)* scaleFactor));
                canvasCtx.lineTo(((triangles[i].vertices[1].x)* scaleFactor) , ((triangles[i].vertices[1].y)* scaleFactor));
                canvasCtx.lineTo(((triangles[i].vertices[2].x)* scaleFactor) , ((triangles[i].vertices[2].y)* scaleFactor));
                canvasCtx.lineTo(((triangles[i].vertices[0].x)* scaleFactor) , ((triangles[i].vertices[0].y)* scaleFactor));
                canvasCtx.closePath();
                canvasCtx.stroke();

        }},

        findBoundingBox(triangles){
            let xMin = triangles[0].vertices[0].x;
            let yMin = triangles[0].vertices[0].y;
            let zMin = triangles[0].vertices[0].z;
            let xMax = triangles[0].vertices[0].x;
            let yMax = triangles[0].vertices[0].y;
            let zMax = triangles[0].vertices[0].z;

            for(let i = 0; i < triangles.length; i++){
                for(let j = 0; j < triangles[i].vertices.length; j++){
                    if (triangles[i].vertices[j].x < xMin){
                        xMin = triangles[i].vertices[j].x;
                        continue;
                    }
                    if(triangles[i].vertices[j].x > xMax){
                        xMax = triangles[i].vertices[j].x;
                        continue;
                    }
                    if(triangles[i].vertices[j].y < yMin){
                        yMin = triangles[i].vertices[j].y;
                        continue;
                    }
                    if(triangles[i].vertices[j].y > yMax){
                        yMax = triangles[i].vertices[j].y;
                        continue;
                    }
                    if(triangles[i].vertices[j].z < zMin){
                        zMin = triangles[i].vertices[j].z;
                        continue;
                    }
                    if(triangles[i].vertices[j].z > zMax){
                        zMax = triangles[i].vertices[j].z;
                        continue;
                    }
                }
            }
            return [
            // 8 vertices of a box
            [xMin, yMin, zMin],
            [xMin, yMin, zMax], 
            [xMin, yMax, zMin], 
            [xMin, yMax, zMax],
            [xMax, yMin, zMin],
            [xMax, yMin, zMax],
            [xMax, yMax, zMin],
            [xMax, yMax, zMax],
            {xMin: xMin, xMax: xMax, yMin: yMin, yMax: yMax, zMin: zMin, zMax: zMax}
            ];
        },

        findTopFacingTriangles(triangles, angle){
            //input angle should have this applied to it
            //Math.sin(Math.abs(theta -90)* Math.PI/ 180))
            let topSurfaceTriangles = [];
            for(let t = 0; t < triangles.length; t++){
                let normal = triangles[t].normal.normalZ;
                if(normal >= angle){
                    topSurfaceTriangles.push(triangles[t]);
                }
            }
            return topSurfaceTriangles;
        },

        findTopSurfaces(triangles){
            let surfaces = [];
            let bB = findBoundingBox(triangles);
            let boundingBox = bB[bB.length -1];
            let clippedTriangles = [];

        },

        triangleInQuadrant(triangle, quadrant){
            for(let i = 0; i < triangle.vertices.length; i++){
                    if(!((quadrant.xMin -1 <= triangle.vertices[i].x) && (triangle.vertices[i].x <= quadrant.xMax + 1))){
                        return false;
                    }
                    if(!((quadrant.yMin -1 <= triangle.vertices[i].y) && (triangle.vertices[i].y <= quadrant.yMax + 1))){
                        return false;
                    }
                    if(!((quadrant.zMin -1 <= triangle.vertices[i].z) && (triangle.vertices[i].z <= quadrant.zMax + 1))){
                        return false;
                    }
            }
            return true;
        },

        divideVolume(boundingBox, triangles){
            let boxCenter = 
            {
                centerX: (((boundingBox.xMax - boundingBox.xMin) / 2) + boundingBox.xMin),
                centerY: (((boundingBox.yMax - boundingBox.yMin) / 2) + boundingBox.yMin),
                centerZ: (((boundingBox.zMax - boundingBox.zMin) / 2) + boundingBox.zMin)
            };

            let firstQuadBottom = {xMin: boxCenter.centerX, xMax: boundingBox.xMax, yMin: boxCenter.centerY, yMax: boundingBox.yMax, zMin: boundingBox.zMin, zMax: boxCenter.centerZ, triangles: []};
            let secondQuadBottom = {xMin: boundingBox.xMin, xMax: boxCenter.centerX, yMin: boxCenter.centerY, yMax: boundingBox.yMax, zMin: boundingBox.zMin, zMax: boxCenter.centerZ, triangles: []};
            let thirdQuadBottom = {xMin: boundingBox.xMin, xMax: boxCenter.centerX, yMin: boundingBox.yMin, yMax: boxCenter.centerY, zMin: boundingBox.zMin, zMax: boxCenter.centerZ, triangles: []};
            let fourthQuadBottom = {xMin: boxCenter.centerX, xMax: boundingBox.xMax, yMin: boundingBox.yMin, yMax: boxCenter.centerY, zMin: boundingBox.zMin, zMax: boxCenter.centerZ, triangles: []};

            let firstQuadTop = {xMin: boxCenter.centerX, xMax: boundingBox.xMax, yMin: boxCenter.centerY, yMax: boundingBox.yMax, zMin: boxCenter.centerZ, zMax: boundingBox.zMax, triangles: []};
            let secondQuadTop = {xMin: boundingBox.xMin, xMax: boxCenter.centerX, yMin: boxCenter.centerY, yMax: boundingBox.yMax, zMin: boxCenter.centerZ, zMax: boundingBox.zMax, triangles: []};
            let thirdQuadTop = {xMin: boundingBox.xMin, xMax: boxCenter.centerX, yMin: boundingBox.yMin, yMax: boxCenter.centerY, zMin: boxCenter.centerZ, zMax: boundingBox.zMax, triangles: []};
            let fourthQuadTop = {xMin: boxCenter.centerX, xMax: boundingBox.xMax, yMin: boundingBox.yMin, yMax: boxCenter.centerY, zMin: boxCenter.centerZ, zMax: boundingBox.zMax, triangles: []};
            for(let i = 0; i < triangles.length; i++){
                if(triangleInQuadrant(triangles[i], thirdQuadTop)){
                    thirdQuadTop.triangles.push(triangles[i]);
                }
             }
            return thirdQuadTop.triangles;
        },

        exportStl(triangles){
            let normTriangles = [];
            let triangleBuffer = new ArrayBuffer((triangles.length * 50) + 84);
            let DV = new DataView(triangleBuffer);
            DV.setUint32(80, triangles.length, true);
            for(let i = 0; i < triangles.length; i++){
                for(let j = 0; j < triangles[i].vertices.length; j++){
                    DV.setFloat32(84 + ((i* 50) + (j*12) + 12), triangles[i].vertices[j].x, true);
                    DV.setFloat32(84 + ((i* 50) + (j*12) + 16), triangles[i].vertices[j].y, true);
                    DV.setFloat32(84 + ((i* 50) + (j*12) + 20), triangles[i].vertices[j].z, true);
                }
                DV.setFloat32(84 + ((i* 50)), triangles[i].normal.normalX, true);
                DV.setFloat32(84 + ((i* 50) + (4)), triangles[i].normal.normalY, true);
                DV.setFloat32(84 + ((i* 50) + (8)), triangles[i].normal.normalZ, true);

            }
            let blob = new Blob([DV.buffer], {type: 'model/stl'});
            const fileURL = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = fileURL;
            downloadLink.download = 'example.stl';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            return normTriangles;
        },

        rotate2D(c1, c2, sin, cos){
            return [(((c1)*cos) - ((c2) * (sin))), (((c1)*sin) + ((c2) * (cos)))];
        },

        rotateSTL(tIn, tOut, xAngle, yAngle, zAngle){
            //must translate to origin before rotation to rotate about object's center
            let sinX = Math.sin((xAngle)* (Math.PI / 180));
            let cosX = Math.cos((xAngle)* (Math.PI / 180));
            let sinY = Math.sin((yAngle)* (Math.PI / 180));
            let cosY = Math.cos((yAngle)* (Math.PI / 180));
            let sinZ = Math.sin((zAngle)* (Math.PI / 180));
            let cosZ = Math.cos((zAngle)* (Math.PI / 180));
            for(let i = 0; i < tOut.length; i++){
                let triangle = {vertices: [], normal: {normalX: 0, normalY: 0, normalZ: 0}};
                for(let j = 0; j < tOut[i].vertices.length; j++){
                    let rotatedPoint = this.rotate2D(tIn[i].vertices[j].y, tIn[i].vertices[j].z, sinX, cosX);
                    tOut[i].vertices[j].y = rotatedPoint[0];
                    tOut[i].vertices[j].z = rotatedPoint[1];
                    rotatedPoint = this.rotate2D(tIn[i].vertices[j].x, tOut[i].vertices[j].z, sinY, cosY);
                    tOut[i].vertices[j].x = rotatedPoint[0];
                    tOut[i].vertices[j].z = rotatedPoint[1];
                    rotatedPoint = this.rotate2D(tOut[i].vertices[j].x, tOut[i].vertices[j].y, sinZ, cosZ);
                    tOut[i].vertices[j].x = rotatedPoint[0];
                    tOut[i].vertices[j].y = rotatedPoint[1];
                }
//                triangle.normal = reNormalizeTriangle(triangles[i]);
            }
        },

        reNormalizeTriangle(triangle){
            let p1 = triangle.vertices[0];
            let p2 = triangle.vertices[1];
            let p3 = triangle.vertices[2];
            let t2x = p2.x - p1.x; // translate triangle to origin
            let t2y = p2.y - p1.y;
            let t2z = p2.z - p1.z;
            let t3x = p3.x - p1.x;
            let t3y = p3.y - p1.y;
            let t3z = p3.z - p1.z;
            let normalZ = (t2x * t3y) - (t3x * t2y);
            let normalX = (t2y * t3z) - (t3y * t2z);
            let normalY = (t2z * t3x) - (t3z * t2x);
            
            let distance = Math.sqrt((Math.pow(normalX, 2)) + (Math.pow(normalY, 2)) + (Math.pow(normalZ, 2)));
            normalX = normalX / distance;
            normalY = normalY / distance;
            normalZ = normalZ / distance;
            return {normalX: normalX, normalY: normalY, normalZ: normalZ}
        },

        reNormalizeTriangles(triangles){
            for(let i = 0; i < triangles.length; i++){
                triangles[i].normal = compute.reNormalizeTriangle(triangles[i]);
            }
        },

        copyTriangles(triangles){
            let copiedTriangles = [];
            for(let i = 0; i < triangles.length; i++){
                let triangleCopy = {vertices:[{x: 0, y:0, z:0}, {x: 0, y:0, z:0}, {x: 0, y:0, z:0}], normal: {normalX: 0, normalY: 0, normalZ: 0}};
                triangleCopy.vertices[0].x = triangles[i].vertices[0].x;
                triangleCopy.vertices[0].y = triangles[i].vertices[0].y;
                triangleCopy.vertices[0].z = triangles[i].vertices[0].z;
                triangleCopy.vertices[1].x = triangles[i].vertices[1].x;
                triangleCopy.vertices[1].y = triangles[i].vertices[1].y;
                triangleCopy.vertices[1].z = triangles[i].vertices[1].z;
                triangleCopy.vertices[2].x = triangles[i].vertices[2].x;
                triangleCopy.vertices[2].y = triangles[i].vertices[2].y;
                triangleCopy.vertices[2].z = triangles[i].vertices[2].z;
                triangleCopy.normal.normalX = triangles[i].normal.normalX;
                triangleCopy.normal.normalY = triangles[i].normal.normalY;
                triangleCopy.normal.normalZ = triangles[i].normal.normalZ;
                copiedTriangles.push(triangleCopy);
            }
            return copiedTriangles;
        },

        extrudeTriangles(triangles, depth){
            let newTriangles = [];
            for(let i = 0; i < triangles.length; i++){
                let t = extrudeTriangleInZ(triangles[i], depth);
                for(let j = 0; j < t.length; j++){
                    newTriangles.push(t[j]);
                }
                newTriangles.push(triangles[i]);
            }
            return newTriangles;
        },

        createTriangle(p1, p2, p3){
            let triangle = {vertices: [{x:p1.x, y:p1.y, z:p1.z}, {x:p2.x, y:p2.y, z:p2.z}, {x:p3.x, y:p3.y, z:p3.z}], normal: {normalX: 0, normalY: 0, normalZ: 0}};
            triangle.normal = reNormalizeTriangle(triangle);
            return triangle;
        },

        extrudeTriangleInZ(triangle, depth){
            //need 7 triangles
            //p1,p2,p5
            //p1, p5, p4
            //p2, p3, p6
            //p2, p6, p5
            //p3, p1,p4
            //p3, p4, p6
            // bottom p6, p5, p4, flipped to keep top triangle orientation
            let p1 = {x: triangle.vertices[0].x, y: triangle.vertices[0].y, z: triangle.vertices[0].z};
            let p2 = {x: triangle.vertices[1].x, y: triangle.vertices[1].y, z: triangle.vertices[1].z};
            let p3 = {x: triangle.vertices[2].x, y: triangle.vertices[2].y, z: triangle.vertices[2].z};
            let p4 = {x: p1.x,y: p1.y,z: (p1.z - depth)};
            let p5 = {x: p2.x,y: p2.y,z: (p2.z - depth)};
            let p6 = {x: p3.x,y: p3.y,z: (p3.z - depth)};
            let t1 = createTriangle(p1, p2, p5);
            let t2 = createTriangle(p1, p5, p4);
            let t3 = createTriangle(p2, p3, p6);
            let t4 = createTriangle(p2, p6, p5);
            let t5 = createTriangle(p3, p1, p4);
            let t6 = createTriangle(p3, p4, p6);
            let t7 = createTriangle(p4, p5, p6);
            return [t1, t2, t3, t4, t5, t6, t7];
        },

        extractConnectedComponentsFromTriangles(triangles){
            let edgeMap = new Map();

            for(let i = 0; i < triangles.length; i++){
                let e1 = compute.hashEdge(triangles[i].vertices[0], triangles[i].vertices[1]);
                let e2 = compute.hashEdge(triangles[i].vertices[1], triangles[i].vertices[2]);
                let e3 = compute.hashEdge(triangles[i].vertices[2], triangles[i].vertices[0]);
                let edge = null;
                if(edgeMap.has(e1)){
                    edge = edgeMap.get(e1);
                    edge.triangles.push(triangles[i]);
                    edgeMap.set(e1, edge);
                } else {
                    edgeMap.set(e1, {hash: e1, triangles: [triangles[i]]});
                }

                if(edgeMap.has(e2)){
                    edge = edgeMap.get(e2);
                    edge.triangles.push(triangles[i]);
                    edgeMap.set(e2, edge);

                } else {
                    edgeMap.set(e2, {hash: e2, triangles: [triangles[i]]});
                }

                if(edgeMap.has(e3)){
                    edge = edgeMap.get(e3);
                    edge.triangles.push(triangles[i]);
                    edgeMap.set(e3, edge);
                } else {
                    edgeMap.set(e3, {hash: e3, triangles: [triangles[i]]});
                }
            }
            let surface = {triangles: []};
            let discoveredEdges = new Map();
            let independentSurfaces = [];
            let currentEdge = edgeMap.values().next().value;
            let e1 = null;
            let e2 = null;
            let e3 = null;
            let edgeMapSize = edgeMap.size;
            if(currentEdge){
                for(let e = 0; e < edgeMapSize + 1; e++){
                    if(currentEdge.triangles.length == 1 && discoveredEdges.size == 0){
                        let e1Hash = compute.hashEdge(currentEdge.triangles[0].vertices[0], currentEdge.triangles[0].vertices[1]);
                        let e2Hash = compute.hashEdge(currentEdge.triangles[0].vertices[1], currentEdge.triangles[0].vertices[2]);
                        let e3Hash = compute.hashEdge(currentEdge.triangles[0].vertices[2], currentEdge.triangles[0].vertices[0]);
                        e1 = edgeMap.get(e1Hash);
                        e2 = edgeMap.get(e2Hash);
                        e3 = edgeMap.get(e3Hash);
                        //independent triangle
                        if(e1.triangles.length == 1 && e2.triangles.length == 1 && e3.triangles.length == 1){
                            surface.triangles.push(currentEdge.triangles[0]);
                            independentSurfaces.push(surface);
                            surface = {triangles: []};
                            edgeMap.delete(e1Hash);
                            edgeMap.delete(e2Hash);
                            edgeMap.delete(e3Hash);
                            currentEdge = edgeMap.values().next().value;
                            if(!edgeMap.size){break}
                            continue;
                        }
                    }

                    let edges = [
                        edgeMap.get(compute.hashEdge(currentEdge.triangles[0].vertices[0], currentEdge.triangles[0].vertices[1])),
                        edgeMap.get(compute.hashEdge(currentEdge.triangles[0].vertices[1], currentEdge.triangles[0].vertices[2])),
                        edgeMap.get(compute.hashEdge(currentEdge.triangles[0].vertices[2], currentEdge.triangles[0].vertices[0]))];
                    if(currentEdge.triangles.length == 2){
                        //1 edges get deleted, 2 edges get turned into 1 and sent to discovered
                        edges.push(edgeMap.get(compute.hashEdge(currentEdge.triangles[1].vertices[0], currentEdge.triangles[1].vertices[1])));
                        edges.push(edgeMap.get(compute.hashEdge(currentEdge.triangles[1].vertices[1], currentEdge.triangles[1].vertices[2])));
                        edges.push(edgeMap.get(compute.hashEdge(currentEdge.triangles[1].vertices[2], currentEdge.triangles[1].vertices[0])));
                        edgeMap.delete(currentEdge.hash);
                        surface.triangles.push(currentEdge.triangles[0]);
                        surface.triangles.push(currentEdge.triangles[1]);
                            for(let i = 0; i < edges.length; i++){
                            if(edges[i].triangles.length == 2){
                                if(!(edges[i].hash == currentEdge.hash)){
                                    let triangleIntersection = compute.findIntersectingTriangle(edges[i].triangles, currentEdge.triangles);
                                    edges[i].triangles.splice(triangleIntersection[0], 1);
                                    edgeMap.set(edges[i].hash, edges[i]);
                                    discoveredEdges.set(edges[i].hash, edges[i]);
                                }
                            } else {
                                edgeMap.delete(edges[i].hash);
                                e++;
                            }
                        }

                        if(discoveredEdges.size){
                            currentEdge = discoveredEdges.values().next().value;
                        } else {
                            discoveredEdges.clear();
                            independentSurfaces.push(surface);
                            surface = {triangles: []};
                            if(edgeMap.size){
                                currentEdge = edgeMap.values().next().value;
                            } else {
                                break}
                        }
                        continue;
                    } 

                    if(currentEdge.triangles.length == 1){
                        for(let i = 0; i < 3; i++){
                            if(edges[i].triangles.length == 2){
                                let triangleIntersection =  compute.findIntersectingTriangle(edges[i].triangles, currentEdge.triangles);
                                edges[i].triangles.splice(triangleIntersection[0], 1);
                                edgeMap.set(edges[i].hash, edges[i]);
                                discoveredEdges.set(edges[i].hash, edges[i]);
                            } else {
                                edgeMap.delete(edges[i].hash);
                                if(discoveredEdges.has(edges[i].hash)){
                                    discoveredEdges.delete(edges[i].hash);
                                }
                            }

                        }
                        surface.triangles.push(currentEdge.triangles[0]);
                        if(discoveredEdges.size){
                            currentEdge = discoveredEdges.values().next().value;
                        } else {
                            independentSurfaces.push(surface);
                            discoveredEdges.clear()
                            surface = {triangles: []};
                            if(edgeMap.size){
                                currentEdge = edgeMap.values().next().value;
                            } else {
                                break;
                            };
                        }

                    }
                }
            }
            return independentSurfaces;

        },

        findIntersectingTriangle(L1, L2){
            for(let i = 0; i < L1.length; i++){
                for(let j = 0; j < L2.length; j++){
                    if(L1[i] == L2[j]){
                        return [i, j];
                    }
                }
            }

        },

        isDeadEnd(e1, e2){
            // one edge has been deleted the other is a 1 edge
            // both edges are deleted from edgeMap
            // both are 1 edges
            let forkEdges = [];
            if(e1 && e1.triangles.length == 2){forkEdges.push(e1)}
            if(e2 && e2.triangles.length == 2){forkEdges.push(e2)}
            if(forkEdges.length == 2){return forkEdges}
        },

        extrudeCameraFacingTopSurfaceTriangles(triangles, depth){
            // count edges
            //find triangles with identical edges, interior edges have exactly two triangles with the same edge, 
            // exterior edges have exactly one triangle using that edge
            let dict = new Map();//make key a concat of first and second point
            for(let i = 0; i < triangles.length; i++){
                let e1 = hashEdge(triangles[i].vertices[0], triangles[i].vertices[1]);
                let e2 = hashEdge(triangles[i].vertices[1], triangles[i].vertices[2]);
                let e3 = hashEdge(triangles[i].vertices[2], triangles[i].vertices[0]);
                if(!dict.has(e1)){
                    dict.set(e1, [{x:triangles[i].vertices[0].x, y:triangles[i].vertices[0].y, z: triangles[i].vertices[0].z}, {x:triangles[i].vertices[1].x, y:triangles[i].vertices[1].y, z:triangles[i].vertices[1].z}]);
                } else {
                    dict.delete(e1);
                }
                if(!dict.has(e2)){
                    dict.set(e2, [{x:triangles[i].vertices[1].x, y:triangles[i].vertices[1].y, z: triangles[i].vertices[1].z}, {x:triangles[i].vertices[2].x, y:triangles[i].vertices[2].y, z:triangles[i].vertices[2].z}]);
                } else {
                    dict.delete(e2);
                }
                if(!dict.has(e3)){
                    dict.set(e3, [{x:triangles[i].vertices[2].x, y:triangles[i].vertices[2].y, z: triangles[i].vertices[2].z}, {x:triangles[i].vertices[0].x, y:triangles[i].vertices[0].y, z:triangles[i].vertices[0].z}]);
                } else {
                    dict.delete(e3);
                }
            }
            let edges = [];
            dict.forEach(edge => {
                edges.push(edge);
            });
            let cycles = findDisjointCycles(edges);
            let groupedCycles = groupCycles(cycles);

            for(let i = 0; i < groupedCycles.length; i++){
                for(let j = 0; j < groupedCycles[i].cycle.length-1; j++){
                    let p1 = {x: groupedCycles[i].cycle[j].x, y:groupedCycles[i].cycle[j].y, z:groupedCycles[i].cycle[j].z};
                    let p2 = {x:groupedCycles[i].cycle[j+1].x, y:groupedCycles[i].cycle[j+1].y, z:groupedCycles[i].cycle[j+1].z};
                    let p2c = {x:p2.x, y:p2.y, z:p2.z};
                    let p3 = {x: p1.x, y:p1.y, z:p1.z-depth};
                    let p3c = {x: p1.x, y:p1.y, z:p1.z -depth};
                    let p4 = {x:p2.x, y:p2.y, z:p2.z -depth};
                    if(groupedCycles[i].perimeter == false){
                        groupedCycles[i].shellTriangles.push({vertices:[p3, p2, p1], normal: {normalX: 0, normalY:0, normalZ:0}});//not showing
                        groupedCycles[i].shellTriangles.push({vertices:[p4, p2c, p3c], normal: {normalX: 0, normalY:0, normalZ:0}});

                    } else {
                        groupedCycles[i].shellTriangles.push({vertices:[p1, p2, p3], normal: {normalX: 0, normalY:0, normalZ:0}}); // not showing
                        groupedCycles[i].shellTriangles.push({vertices:[p3c, p2c, p4], normal: {normalX: 0, normalY:0, normalZ:0}});
                    }                
                }
            }
        return groupedCycles;
        },

        hashEdge(v1, v2){
            let e = ""; 
            let v1x = parseFloat(v1.x.toFixed(4));
            let v1y = parseFloat(v1.y.toFixed(4));
            let v1z = parseFloat(v1.z.toFixed(4));
            let v2x = parseFloat(v2.x.toFixed(4));
            let v2y = parseFloat(v2.y.toFixed(4));
            let v2z = parseFloat(v2.z.toFixed(4));
            if(v1x < v2x){
                    e = v1x.toString()+v2x.toString();
                }
                if(v2x < v1x) {
                    e = v2x.toString()+v1x.toString();
                }
                if(v1x == v2x){
                    e  = v1x.toString();
                }
                if(v1y < v2y){
                    e  = e+v1y.toString()+v2y.toString();                    
                }
                if(v2y < v1y) {
                    e  = e+v2y.toString()+v1y.toString();
                }
                if(v1y == v2y){
                    e  = e+v1y.toString();
                }
                if(v1z < v2z){
                    e  = e+v1z.toString()+v2z.toString();
                } 
                if(v2z < v1z) {
                    e  = e+v2z.toString()+v1z.toString();
                }
                if(v1z == v2z){
                    e  = e+v1z.toString();
                } 
            return e;
        },

        findDisjointCycles(edges){
            //this might not work anymore due to having proper connected component extraction,
            //might need to rewrite this with simpler assumptions now
            
            //there can be any number of disjoint cycles within the edge list
            //map to hash points to a key and store the collisions as neighbors, then walk them
            let pointMap = new Map();
            for(let i = 0; i < edges.length; i++){
                let p1Hash = compute.hashPoint(edges[i][0]);
                let p2Hash = compute.hashPoint(edges[i][1]);

                if(!pointMap.has(p1Hash)){
                    pointMap.set(p1Hash, {currentPoint: edges[i][0], neighbor1: p2Hash, neighbor2: null, hash: p1Hash});
                }   else {
                    let newEdges = pointMap.get(p1Hash);
                    newEdges.neighbor2 = p2Hash;
                }

                if(!pointMap.has(p2Hash)){
                    pointMap.set(p2Hash, {currentPoint: edges[i][1], neighbor1: p1Hash, neighbor2: null, hash: p2Hash});
                }   else {
                    let newEdges = pointMap.get(p2Hash);
                    newEdges.neighbor2 = p1Hash;
                }
            }
            return compute.walkEdges(pointMap);
        },

        walkEdges(pointMap){
            let cycles = [];
            let currentCycle = [];
            let startPoint = null;
            let n1 = null;
            while(pointMap.size){
                if(currentCycle.length){
                    if(startPoint.hash == n1.hash && currentCycle.length == 1){
                        if(pointMap.has(n1.neighbor1)){
                            n1 = pointMap.get(n1.neighbor1);
                        }
                        else{
                            n1 = pointMap.get(n1.neighbor2);
                        }
                        currentCycle.push(n1.currentPoint);
                        pointMap.delete(n1.hash);
                    } else {
                        if(pointMap.has(n1.neighbor1)){
                            n1 = pointMap.get(n1.neighbor1);
                        } else{
                            n1 = pointMap.get(n1.neighbor2);
                        }
                        if(!n1){
                            currentCycle.push({x: startPoint.currentPoint.x, y:startPoint.currentPoint.y, z:startPoint.currentPoint.z});
                            cycles.push(currentCycle);
                            currentCycle = [];
                        } else{
                            currentCycle.push(n1.currentPoint);
                            pointMap.delete(n1.hash);
                        }
                    }
                    if(!pointMap.size){
                        currentCycle.push({x: startPoint.currentPoint.x, y:startPoint.currentPoint.y, z:startPoint.currentPoint.z});
                        cycles.push(currentCycle);
                    }
                } else {
                    startPoint = pointMap.values().next().value;
                    currentCycle.push(startPoint.currentPoint);
                    pointMap.delete(startPoint.hash);
                    n1 = startPoint;
                }
            }
            return cycles;
        },

        hashPoint(point){
            return point.x.toFixed(4) + point.y.toFixed(4) + point.z.toFixed(4);
        },

        groupCycles(cycles){
            let groupedCycles = [];
            let largestArea = 0;
            for(let i = 0; i < cycles.length; i++){
                let area = Math.abs(findAreaOfCycle(cycles[i]));
                let groupedCycle = {cycle: [], area: 0, perimeter: false, shellTriangles: []};
                groupedCycle.cycle = cycles[i];
                groupedCycle.area = area;
                groupedCycles.push(groupedCycle);
                if(area>largestArea){
                    largestArea = area;
                }
            }
            for(let i = 0; i < groupedCycles.length; i++){
                if(groupedCycles[i].area == largestArea){
                    groupedCycles[i].perimeter = true;
                    let reversedCycle = reverseCycle(groupedCycles[i].cycle);
                    groupedCycles[i].cycle = reversedCycle;
                }
            }
            return groupedCycles;
        },

        findAreaOfCycle(cycle){
            let area = 0;
            for(let i = 0; i < cycle.length-1; i++){
                area += (cycle[i+1].y + cycle[i].y) * (cycle[i+1].x - cycle[i].x);
            }
            return area * 0.5;
        },

        reverseCycle(cycle){
            let reversedCycle = [];
            for(let i = cycle.length-1; i >= 0; i--){
                reversedCycle.push(cycle[i]);
            }
            return reversedCycle;
        },

        checkTriangleDegeneracy(triangle){
            let p1 = triangle.vertices[0];
            let p2 = triangle.vertices[1];
            let p3 = triangle.vertices[2];
            let p1p2 = 0;
            let p1p3 = 0;
            let p2p3 = 0;
            if((p1.x == p2.x) && (p1.y == p2.y) && (p1.z == p2.z)){p1p2 = 1};
            if((p1.x == p3.x) && (p1.y == p3.y) && (p1.z == p3.z)){p1p3 = 1};
            if((p2.x == p3.x) && (p2.y == p3.y) && (p2.z == p3.z)){p2p3 = 1};

            if (p1p2 + p1p3 + p2p3 > 0){
            }
        },

        lexiSortPointsFromTriangles(triangles){
            let points = [];
            for(let i = 0; i < triangles.length; i++){
                let point = {};
                for(let j = 0; j < triangles[i].vertices.length; j++){
                    point = triangles[i].vertices[j];
                    point.index = triangles[i].index;
                    points.push(point);
                }
            }
            return points.sort((a, b)=>{
                if(a.z != b.z){
                    return a.z-b.z;
                }
                if(a.x != b.x){
                    return a.x-b.x;
                }
                if(a.y != b.y){
                    return a.y-b.y;
                }
                return 0;
            });
        },

        decreaseZInTopFacingTrianglesFromLexiPoints(triangles, lexiSortedPoints, depth, angle){
            lexiSortedPoints.push({x: null, y: null, z: null}); 
            let deepTriangles = [];
            for(let i = 0; i < triangles.length; i++){
                let deepObject = structuredClone(triangles[i]);
                deepTriangles.push(deepObject);

            };
            let decreasedZTriangles = [];
            let contiguousTriangles = [];
            for(let i = 1; i < lexiSortedPoints.length; i++){
                if(lexiSortedPoints[i-1].x == lexiSortedPoints[i].x && lexiSortedPoints[i-1].y == lexiSortedPoints[i].y && lexiSortedPoints[i-1].z == lexiSortedPoints[i].z){
                    contiguousTriangles.push(triangles[lexiSortedPoints[i-1].index]);
                } else {
                    contiguousTriangles.push(triangles[lexiSortedPoints[i-1].index]);
                    let t = findTopFacingTriangles(contiguousTriangles, angle);
                    if(t.length){
                        for(let t = 0; t < contiguousTriangles.length; t++){
                            for(let p = 0; p < contiguousTriangles[t].vertices.length; p++){
                                if(lexiSortedPoints[i-1].x == triangles[contiguousTriangles[t].index].vertices[p].x && lexiSortedPoints[i-1].y == triangles[contiguousTriangles[t].index].vertices[p].y && lexiSortedPoints[i-1].z == triangles[contiguousTriangles[t].index].vertices[p].z){
                                    if(deepTriangles[contiguousTriangles[t].index].vertices[p].z <= depth){
                                        deepTriangles[contiguousTriangles[t].index].vertices[p].z = 0;
                                    } else {
                                    deepTriangles[contiguousTriangles[t].index].vertices[p].z -= depth;
                                    }
                                //decreasedZTriangles.push(decreasedZTriangle);
                                break;

                                }
                            }
                        }
                    }
                    contiguousTriangles = [];
                }
            }
            return deepTriangles;
        },

        updateStlTranslation(stlObject, x, y, z){
            stlObject.planarScaffold.xShift = x;
            stlObject.planarScaffold.yShift = y;
            stlObject.planarScaffold.zShift = z;
        },

        translateStl(tIn, tOut, xShift, yShift, zShift){
            for(let i = 0; i < tIn.length; i++){
                for(let j = 0; j < 3; j++){
                    tOut[i].vertices[j].x = tIn[i].vertices[j].x + xShift;
                    tOut[i].vertices[j].y = tIn[i].vertices[j].y + yShift;
                    tOut[i].vertices[j].z = tIn[i].vertices[j].z + zShift;
                }
            }
        },

        findStlCentroid(triangles){
            let xTotal = 0;
            let yTotal = 0;
            let zTotal = 0;
            for(let i = 0; i < triangles.length; i++){
                for(let p = 0; p < triangles[i].vertices.length; p++){
                    xTotal += triangles[i].vertices[p].x;
                    yTotal += triangles[i].vertices[p].y;
                    zTotal += triangles[i].vertices[p].z;
                }
            }
            return [xTotal/ (triangles.length * 3), yTotal / (triangles.length * 3), zTotal / (triangles.length * 3)];
        },

        canvasFocus(event){
            state.buildPlate.dragStartX = event.clientX;
            state.buildPlate.dragStartY = event.clientY;
        },

        canvasBlur(){
            let canvas = document.getElementById("viewport");
            canvas.classList.add("canvasBlur");
            canvas.classList.remove("canvasFocus");
            
        },

        canvasDragRotate(event){            
            compute.rotateView(parseInt(event.clientY), parseInt(event.clientX), 0);
        },

        updateZMin(){
             let zMinInput= document.getElementById("zMinInputId");
             let zTranslationInput = document.getElementById("zTranslationInputId");
             let stlObject = state.objects.get(state.selectedId);
             if(zMinInput.checked){
                stlObject.planarScaffold.zShift = 0;
                zTranslationInput.value = 0;
                zTranslationInput.disabled = true;
                stlObject.planarScaffold.Zmin = true;
                compute.rotateView(state.buildPlate.xAngle, state.buildPlate.yAngle, state.buildPlate.zAngle);
                stlObject.checked = true;
            } else{
                zTranslationInput.disabled = false;
                stlObject.planarScaffold.Zmin = false;
                stlObject.checked = false;
            }
        },

        findZmin(triangles){
            let Zmin = triangles[0].vertices[0].z;
            for(let i = 0; i < triangles.length; i++){
                for(let j = 0; j < triangles[i].vertices.length; j++){
                    if(triangles[i].vertices[j].z < Zmin){
                        Zmin = triangles[i].vertices[j].z;
                    }
                }
            }
            return Zmin;
        },

        settingsButtonHover(event){
            let settingsDiv = document.getElementById("settings");
            event.target.classList.toggle("settingsButtonPressed");
            event.target.classList.toggle("settingsButton");
            settingsDiv.classList.toggle("settingsDivHidden");
        },

        settingsButtonBlur(event){
            let settingsDiv = document.getElementById("settings");
            settingsDiv.classList.toggle("settingsDivVisible");
            settingsDiv.classList.toggle("settingsDivHidden");
        },

        updateMaxSlopeAngle(event){
            let stlObject = state.objects.get(state.selectedId);
            stlObject.prevMaxSlopeAngle = stlObject.maxSlopeAngle;
            stlObject.maxSlopeAngle = event.target.value;
            compute.rotateView(state.buildPlate.xAngle, state.buildPlate.yAngle, state.buildPlate.zAngle);
            slicerApp.renderSidebar();
        },
        
        updateCanvas(){
//            state.buildPlate.updateBuildPlateDimensions();
//            state.buildPlate.createBuildPlateSegments();
//            state.buildPlate.translateBuildPlateCenterToOrigin();
//            state.buildPlate.rotateBuildPlate();
            state.buildPlate.drawSegmentsToCanvas(state.buildPlate.rotSegments);
            state.objects.forEach((stlObject)=>{
            compute.drawTrianglesToCanvas(stlObject.planarScaffold.triangles, "#00ff00");
            });
            if(false && stlObject.planarScaffold && stlObject.planarScaffold.triangles){
                let maxSlopeAngle = Math.sin(Math.abs(document.getElementById("maxSlopeAngleId").value - 90) * Math.PI / 180);
                let nonPlanarThickness = parseFloat(document.getElementById("nonPlanarThickness").value);
                //find center of planarScaffold before rotation
                let bb = findBoundingBox(stlObject.planarScaffold.origTriangles);
                bb = bb[bb.length-1];
                let center = [((bb.xMax-bb.xMin)/2) + bb.xMin, ((bb.yMax - bb.yMin) /2) + bb.yMin];
                rotateSTL(stlObject.planarScaffold.origTriangles, stlObject.planarScaffold.triangles, stlObject.planarScaffold.xAngle, stlObject.planarScaffold.yAngle, stlObject.planarScaffold.zAngle);
                rotateSTL(stlObject.nonPlanarTopSurface.origTriangles, stlObject.nonPlanarTopSurface.triangles, stlObject.planarScaffold.xAngle, stlObject.planarScaffold.yAngle, stlObject.planarScaffold.zAngle);
                if(stlObject.planarScaffold.zMin !== false){
                    let bb = findBoundingBox(stlObject.planarScaffold.triangles);
                    bb = bb[bb.length-1];
                    stlObject.planarScaffold.zMin = bb.zMin * -1;
                }
                bb = findBoundingBox(stlObject.planarScaffold.triangles);
                bb = bb[bb.length-1];
                let centerAfterRotation = [((bb.xMax-bb.xMin)/2) + bb.xMin, ((bb.yMax - bb.yMin) /2) + bb.yMin];
                let centerXShift = center[0] - centerAfterRotation[0];
                let centerYShift = center[1] - centerAfterRotation[1];
                translateStl(stlObject.planarScaffold.triangles, stlObject.planarScaffold.triangles, stlObject.planarScaffold.xShift + centerXShift, stlObject.planarScaffold.yShift + centerYShift, stlObject.planarScaffold.zShift + stlObject.planarScaffold.zMin);
                translateStl(stlObject.nonPlanarTopSurface.triangles, stlObject.nonPlanarTopSurface.triangles, stlObject.nonPlanarTopSurface.xShift + stlObject.planarScaffold.xShift + centerXShift, stlObject.nonPlanarTopSurface.yShift + stlObject.planarScaffold.yShift + centerYShift, stlObject.nonPlanarTopSurface.zShift + stlObject.planarScaffold.zMin + stlObject.planarScaffold.zShift);

                reNormalizeTriangles(stlObject.planarScaffold.triangles);
                reNormalizeTriangles(stlObject.nonPlanarTopSurface.triangles); //only needs to be done when planarScaffold is rotated

//                let lexiSortedPoints = lexiSortPointsFromTriangles(stlObject.planarScaffold.triangles);
//                let lexiSortedTrianglesZdecrease = decreaseZInTopFacingTrianglesFromLexiPoints(stlObject.planarScaffold.triangles, lexiSortedPoints, nonPlanarThickness, maxSlopeAngle);

//                let tft = findTopFacingTriangles(stlObject.nonPlanarTopSurface.triangles, maxSlopeAngle);
//                let extractedConnectedComponents = extractConnectedComponentsFromTriangles(tft);
//                let extractedTriangles = [];
//                for(let i = 0; i < extractedConnectedComponents.length; i++){
//                    for(let j = 0; j < extractedConnectedComponents[i].triangles.length; j++){
//                        extractedTriangles.push(extractedConnectedComponents[i].triangles[j]);
//                }
//                }
//                tft = extractedTriangles;
                // let extrudedTriangles = extrudeCameraFacingTopSurfaceTriangles(tft, nonPlanarThickness);
                
                // let perimeterTriangles = [];
                // let holeTriangles = [];
                // for(let i = 0; i < extrudedTriangles.length; i++){
                //     if(extrudedTriangles[i].perimeter != true){
                //         for(let j = 0; j< extrudedTriangles[i].shellTriangles.length; j++){
                //             holeTriangles.push(extrudedTriangles[i].shellTriangles[j]);
                //         }

                //     } else {
                //         for(let j = 0; j< extrudedTriangles[i].shellTriangles.length; j++){
                //             perimeterTriangles.push(extrudedTriangles[i].shellTriangles[j]);
                //         }

                //     }
                // }

                // let bft = [];
                // for(let i =0; i<tft.length;i++){
                //     let p1 = {x:tft[i].vertices[0].x, y:tft[i].vertices[0].y, z:tft[i].vertices[0].z - nonPlanarThickness};
                //     let p2 = {x:tft[i].vertices[1].x, y:tft[i].vertices[1].y, z:tft[i].vertices[1].z - nonPlanarThickness};
                //     let p3 = {x:tft[i].vertices[2].x, y:tft[i].vertices[2].y, z:tft[i].vertices[2].z - nonPlanarThickness};
                //     bft.push({vertices:[p1,p2,p3], normal: {normalX: 0, normalY: 0, normalZ: 0}});
                // }

//                rotateSTL(lexiSortedTrianglesZdecrease, lexiSortedTrianglesZdecrease, buildPlate.xAngle, buildPlate.yAngle, buildPlate.zAngle);
//                rotateSTL(tft, tft, buildPlate.xAngle, buildPlate.yAngle, buildPlate.zAngle);
//                rotateSTL(bft, bft, buildPlate.xAngle, buildPlate.yAngle, buildPlate.zAngle);

//                reNormalizeTriangles(tft);
//                reNormalizeTriangles(bft);

//                let cameraVect = {x: 0, y:0, z: 1};
//                let lt = {
//                sinX:Math.sin(buildPlate.xAngle * (Math.PI / 180)), cosX:Math.cos(buildPlate.xAngle * (Math.PI / 180)),
//                sinY:Math.sin(buildPlate.yAngle * (Math.PI / 180)), cosY:Math.cos(buildPlate.yAngle * (Math.PI / 180)),
//                sinZ:Math.sin(buildPlate.zAngle * (Math.PI / 180)), cosZ:Math.cos(buildPlate.zAngle * (Math.PI / 180))};
//                state.buildPlate.rotatePoint(cameraVect, cameraVect, state.buildPlate.xAngle, state.buildPlate.yAngle, state.buildPlate.zAngle, lt);
//                let cameraFacingTft = [];
//                let cameraFacingBft = [];
//                let cameraFacingHoleTriangles = [];
//                let cameraFacingPerimeterTriangles = [];
//                let cameraFacingExtrudedTriangles = [];
//                for(let i = 0; i < tft.length; i++){
//                    if(tft[i].normal.normalZ >= 0){
//                            cameraFacingTft.push(tft[i]);
//                    }
//                }
//
//                for(let i = 0; i < bft.length; i++){
//                    if(bft[i].normal.normalZ < 0){
//                        cameraFacingBft.push(bft[i]);
//                    }
//                }

                // for(let i = 0; i < holeTriangles.length; i++){
                //         if(holeTriangles[i].normal.normalZ >= 0){
                //             cameraFacingHoleTriangles.push(holeTriangles[i]);
                //         }
                //     }

                //     for(let i = 0; i < perimeterTriangles.length; i++){
                //         if(perimeterTriangles[i].normal.normalZ >= 0){
                //             cameraFacingPerimeterTriangles.push(perimeterTriangles[i]);
                //         }
                //     }

//                drawTrianglesToCanvasFilled(stlObject.nonPlanarTopSurface.triangles, "teal", "black");


            }
        },

        translateStlFromInput(){
            let xTranslationInput = parseFloat(document.getElementById("xTranslationInputId").value);
            let yTranslationInput = parseFloat(document.getElementById("yTranslationInputId").value);
            let zTranslationInput = parseFloat(document.getElementById("zTranslationInputId").value);
            let zTranslationInputNonPlanar = parseFloat(document.getElementById("zTranslationInputNonPlanarId").value);
            stlObject = state.objects.get(state.selectedId);
            stlObject.planarScaffold.xShift = xTranslationInput;
            stlObject.planarScaffold.yShift = yTranslationInput;
            stlObject.planarScaffold.zShift = zTranslationInput;
            stlObject.nonPlanarSurfaceOffset = zTranslationInputNonPlanar;
            compute.rotateView(state.buildPlate.xAngle, state.buildPlate.yAngle, state.buildPlate.zAngle);
        },

        rotateView(xAngle, yAngle, zAngle){
            state.buildPlate.xAngle = xAngle;
            state.buildPlate.yAngle = yAngle;
            state.buildPlate.zAngle = zAngle;
            state.buildPlate.rotateBuildPlate();
            state.buildPlate.drawSegmentsToCanvas(state.buildPlate.rotSegments);
            state.objects.forEach((stlObject)=>{
                if(stlObject.visible){
                let bb = compute.findBoundingBox(stlObject.planarScaffold.origTriangles);
                bb = bb[bb.length-1];
                let center = [((bb.xMax-bb.xMin)/2) + bb.xMin, ((bb.yMax - bb.yMin) /2) + bb.yMin, (bb.zMax - bb.zMin)/2 + bb.zMin];
                compute.translateStl(stlObject.planarScaffold.origTriangles, stlObject.planarScaffold.triangles, center[0] * -1, center[1] * -1, center[2] * -1);
                compute.rotateSTL(stlObject.planarScaffold.triangles, stlObject.planarScaffold.triangles, stlObject.planarScaffold.xAngle, stlObject.planarScaffold.yAngle, stlObject.planarScaffold.zAngle);

                if(stlObject.planarScaffold.Zmin){
                    let Zmin = compute.findZmin(stlObject.planarScaffold.triangles);
                    center[2] = -1 * Zmin;
                    stlObject.planarScaffold.zShift = 0;
                }
                compute.translateStl(stlObject.planarScaffold.triangles, stlObject.planarScaffold.triangles, center[0] + stlObject.planarScaffold.xShift, center[1] + stlObject.planarScaffold.yShift, center[2] + stlObject.planarScaffold.zShift);
                compute.reNormalizeTriangles(stlObject.planarScaffold.triangles);
                stlObject.children = compute.findTopFacingTriangles(stlObject.planarScaffold.triangles, Math.sin(Math.abs(stlObject.maxSlopeAngle - 90)* Math.PI/ 180));
                stlObject.children = compute.copyTriangles(stlObject.children);
                compute.translateStl(stlObject.children, stlObject.children, 0, 0, stlObject.nonPlanarSurfaceOffset);
                stlObject.children = compute.extractConnectedComponentsFromTriangles(stlObject.children);
                stlObject.prevMaxSlopeAngle = stlObject.maxSlopeAngle;

                for(let i = 0; i < stlObject.children.length; i++){
                    let triangleRegion = new TriangleRegion(stlObject, stlObject.children[i].triangles, i);
                    compute.rotateSTL(triangleRegion.triangles, triangleRegion.triangles, state.buildPlate.xAngle, state.buildPlate.yAngle, state.buildPlate.zAngle);
                    stlObject.children[i] = triangleRegion;
                }
                compute.rotateSTL(stlObject.planarScaffold.triangles, stlObject.planarScaffold.triangles, state.buildPlate.xAngle, state.buildPlate.yAngle, state.buildPlate.zAngle);

                if(stlObject.id == state.selectedId){
                    compute.drawTrianglesToCanvas(stlObject.planarScaffold.triangles, "white");
                    for(let i = 0; i < stlObject.children.length; i++){
                        compute.drawTrianglesToCanvasFilled(stlObject.children[i].triangles, "#00ff00", "black");
                    }

                } else {
                    this.drawTrianglesToCanvas(stlObject.planarScaffold.triangles, "blue");
                    for(let i = 0; i < stlObject.children.length; i++){
                        compute.drawTrianglesToCanvasFilled(stlObject.children[i].triangles, "yellow", "black");
                    }

                }
                }
            })


            if(false && stlObject && stlObject.planarScaffold && stlObject.planarScaffold.triangles){
//                let maxSlopeAngle = Math.sin(Math.abs(document.getElementById("maxSlopeAngleId").value - 90) * Math.PI / 180);
//                let nonPlanarThickness = parseFloat(document.getElementById("nonPlanarThickness").value);
 
                let bb = compute.findBoundingBox(stlObject.planarScaffold.origTriangles);
                bb = bb[bb.length-1];
                let center = [((bb.xMax-bb.xMin)/2) + bb.xMin, ((bb.yMax - bb.yMin) /2) + bb.yMin, (bb.zMax - bb.zMin)/2 + bb.zMin];
                compute.translateStl(stlObject.planarScaffold.origTriangles, stlObject.planarScaffold.triangles, center[0]*-1, center[1] * -1, center[2] * -1);
                compute.rotateSTL(stlObject.planarScaffold.origTriangles, stlObject.planarScaffold.triangles, stlObject.planarScaffold.xAngle, stlObject.planarScaffold.yAngle, stlObject.planarScaffold.zAngle);
//                rotateSTL(stlObject.nonPlanarTopSurface.origTriangles, stlObject.nonPlanarTopSurface.triangles, stlObject.planarScaffold.xAngle, stlObject.planarScaffold.yAngle, stlObject.planarScaffold.zAngle);
                if(document.getElementById("zMinInputId").checked){
                    let Zmin = compute.findZmin(stlObject.planarScaffold.triangles);
                    compute.translateStl(stlObject.planarScaffold.origTriangles, stlObject.planarScaffold.triangles, center[0]+stlObject.planarScaffold.xShift, center[1] + stlObject.planarScaffold.yShift, center[2] + Zmin  -1);
                    //
                } else {
                    compute.translateStl(stlObject.planarScaffold.origTriangles, stlObject.planarScaffold.triangles, center[0]+stlObject.planarScaffold.xShift, center[1] + stlObject.planarScaffold.yShift, center[2]+stlObject.planarScaffold.zShift);
                }
                
//                translateStl(stlObject.planarScaffold.triangles, stlObject.planarScaffold.triangles, stlObject.planarScaffold.xShift + centerXShift, stlObject.planarScaffold.yShift + centerYShift, stlObject.planarScaffold.zShift + stlObject.planarScaffold.zMin);
//                translateStl(stlObject.nonPlanarTopSurface.triangles, stlObject.nonPlanarTopSurface.triangles, stlObject.nonPlanarTopSurface.xShift + stlObject.planarScaffold.xShift + centerXShift, stlObject.nonPlanarTopSurface.yShift + stlObject.planarScaffold.yShift + centerYShift, stlObject.nonPlanarTopSurface.zShift + stlObject.planarScaffold.zMin + stlObject.planarScaffold.zShift);


//                reNormalizeTriangles(stlObject.planarScaffold.triangles);
//                reNormalizeTriangles(stlObject.nonPlanarTopSurface.triangles);
//
//                let lexiSortedPoints = lexiSortPointsFromTriangles(stlObject.planarScaffold.triangles);
//                let lexiSortedTrianglesZdecrease = decreaseZInTopFacingTrianglesFromLexiPoints(stlObject.planarScaffold.triangles, lexiSortedPoints, nonPlanarThickness, maxSlopeAngle);
//
//                let tft = findTopFacingTriangles(stlObject.nonPlanarTopSurface.triangles, maxSlopeAngle);
//                let extractedConnectedComponents = extractConnectedComponentsFromTriangles(tft);
//                let extractedTriangles = [];
//                for(let i = 0; i < extractedConnectedComponents.length; i++){
//                    for(let j = 0; j < extractedConnectedComponents[i].triangles.length; j++){
//                        extractedTriangles.push(extractedConnectedComponents[i].triangles[j]);
//                    }
//                }
//                tft = extractedTriangles;
                // let extrudedTriangles = extrudeCameraFacingTopSurfaceTriangles(tft, nonPlanarThickness);
                
                // let perimeterTriangles = [];
                // let holeTriangles = [];
                // for(let i = 0; i < extrudedTriangles.length; i++){
                //     if(extrudedTriangles[i].perimeter != true){
                //         for(let j = 0; j< extrudedTriangles[i].shellTriangles.length; j++){
                //             holeTriangles.push(extrudedTriangles[i].shellTriangles[j]);
                //         }

                //     } else {
                //         for(let j = 0; j< extrudedTriangles[i].shellTriangles.length; j++){
                //             perimeterTriangles.push(extrudedTriangles[i].shellTriangles[j]);
                //         }

                //     }
                // }

//                let bft = [];
//                for(let i =0; i<tft.length;i++){
//                    let p1 = {x:tft[i].vertices[0].x, y:tft[i].vertices[0].y, z:tft[i].vertices[0].z - nonPlanarThickness};
//                    let p2 = {x:tft[i].vertices[1].x, y:tft[i].vertices[1].y, z:tft[i].vertices[1].z - nonPlanarThickness};
//                    let p3 = {x:tft[i].vertices[2].x, y:tft[i].vertices[2].y, z:tft[i].vertices[2].z - nonPlanarThickness};
//                    bft.push({vertices:[p1,p2,p3], normal: {normalX: 0, normalY: 0, normalZ: 0}});
//                }
//
//                rotateSTL(lexiSortedTrianglesZdecrease, lexiSortedTrianglesZdecrease, buildPlate.xAngle, buildPlate.yAngle, buildPlate.zAngle);
//                rotateSTL(tft, tft, buildPlate.xAngle, buildPlate.yAngle, buildPlate.zAngle);
//                rotateSTL(bft, bft, buildPlate.xAngle, buildPlate.yAngle, buildPlate.zAngle);
                // rotateSTL(holeTriangles, holeTriangles, buildPlate.xAngle, buildPlate.yAngle, buildPlate.zAngle);
                // rotateSTL(perimeterTriangles, perimeterTriangles, buildPlate.xAngle, buildPlate.yAngle, buildPlate.zAngle);

//                reNormalizeTriangles(tft);
//                reNormalizeTriangles(bft);

//                let cameraVect = {x: 0, y:0, z: 1};
//                let lt = {
//                sinX:Math.sin(buildPlate.xAngle * (Math.PI / 180)), cosX:Math.cos(buildPlate.xAngle * (Math.PI / 180)),
//                sinY:Math.sin(buildPlate.yAngle * (Math.PI / 180)), cosY:Math.cos(buildPlate.yAngle * (Math.PI / 180)),
//                sinZ:Math.sin(buildPlate.zAngle * (Math.PI / 180)), cosZ:Math.cos(buildPlate.zAngle * (Math.PI / 180))};
//                buildPlate.rotatePoint(cameraVect, cameraVect, buildPlate.xAngle, buildPlate.yAngle, buildPlate.zAngle, lt);
//                let cameraFacingTft = [];
//                let cameraFacingBft = [];
//                let cameraFacingHoleTriangles = [];
//                let cameraFacingPerimeterTriangles = [];
//                let cameraFacingExtrudedTriangles = [];
//                for(let i = 0; i < tft.length; i++){
//                    if(tft[i].normal.normalZ >= 0){
//                            cameraFacingTft.push(tft[i]);
//                    }
//                }
//
//                for(let i = 0; i < bft.length; i++){
//                    if(bft[i].normal.normalZ < 0){
//                        cameraFacingBft.push(bft[i]);
//                    }
//                }

                // for(let i = 0; i < holeTriangles.length; i++){
                //         if(holeTriangles[i].normal.normalZ >= 0){
                //             cameraFacingHoleTriangles.push(holeTriangles[i]);
                //         }
                //     }

                //     for(let i = 0; i < perimeterTriangles.length; i++){
                //         if(perimeterTriangles[i].normal.normalZ >= 0){
                //             cameraFacingPerimeterTriangles.push(perimeterTriangles[i]);
                //         }
                //     }

//                drawTrianglesToCanvasFilled(lexiSortedTrianglesZdecrease, "teal", "black");
//                if(cameraVect.z >= 0){
                    // drawTrianglesToCanvasFilled(cameraFacingHoleTriangles, "orange", "black");                    
//                    drawTrianglesToCanvasFilled(cameraFacingBft, "#48494B", "black");
                    // drawTrianglesToCanvasFilled(cameraFacingPerimeterTriangles, "gray", "black");
//                    drawTrianglesToCanvasFilled(cameraFacingTft, "gray", "black");
//                } else {
                    // drawTrianglesToCanvasFilled(cameraFacingHoleTriangles, "orange", "black");
//                    drawTrianglesToCanvasFilled(cameraFacingBft, "#48494B", "black");
//                    drawTrianglesToCanvas(cameraFacingTft, "gray");
                    // drawTrianglesToCanvasFilled(cameraFacingPerimeterTriangles, "gray", "black");

                //}

            }
        },

        rotateStlFromInput(){
            stlObject = state.objects.get(state.selectedId);
            let xRotationInput = document.getElementById("xRotationInputId");
            let yRotationInput = document.getElementById("yRotationInputId");
            let zRotationInput = document.getElementById("zRotationInputId");
            stlObject.planarScaffold.xAngle = parseFloat(xRotationInput.value);
            stlObject.planarScaffold.yAngle = parseFloat(yRotationInput.value);
            stlObject.planarScaffold.zAngle = parseFloat(zRotationInput.value);            
            compute.rotateView(state.buildPlate.xAngle, state.buildPlate.yAngle, state.buildPlate.zAngle);
        },


        slice(){
            //this might not work anymore
            let maxSlopeAngle = Math.cos((parseFloat(document.getElementById("maxSlopeAngleId").value) / 180) * Math.PI);

            for(let i = 0; i < stls.length; i++){
                let boundingBox = findBoundingBox(stls[i].fileData.triangles);
                stls[i].boundingBox = boundingBox[boundingBox.length -1];
            }

            let rotatedStl = rotateSTL(stlObject.planarScaffold.origTriangles, stlObject.planarScaffold.triangles, 0, 0, 0);

            let lexiSortedPoints = lexiSortPointsFromTriangles(rotatedStl);
            let lexiSortedTrianglesZdecrease = decreaseZInTopFacingTrianglesFromLexiPoints(rotatedStl, lexiSortedPoints, 1);

            let topFacingTriangles = findTopFacingTriangles(rotatedStl, maxSlopeAngle);
            let extrudedTriangles = extrudeTriangles(topFacingTriangles, 1);

            let ntopSurfBB = findBoundingBox(lexiSortedTrianglesZdecrease);
            ntopSurfBB = ntopSurfBB[ntopSurfBB.length -1];
            
            drawTrianglesToCanvas(lexiSortedTrianglesZdecrease, "#00ff00");
            exportStl(lexiSortedTrianglesZdecrease);
            exportStl(extrudedTriangles);
        },

    };
