// Description: This file contains the ObjectReader class which is responsible for reading the .obj and .mtl files.
// https://all3dp.com/2/obj-file-format-simply-explained/
class ObjectReader {

    readMtlFile(file) {
        const mtlFileName = file.substring(0, file.lastIndexOf(".")) + ".mtl"
        const fileContent = this.#loadFileContent(mtlFileName);
        return this.#parseMtlFile(fileContent);
    }

    readObjFile(file) {
        let fileContent = this.#loadFileContent(file);
        return  this.#parseObjFormat(fileContent);
    }


    #loadFileContent(file) {
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", file, false);
        xmlHttp.send();
        if (xmlHttp.status === 404) {
            return "";
        }
        return xmlHttp.responseText;
    }

    #parseObjFormat(data) {
        let vertex = [];
        let faces = [];
        let lines = data.split('\n');
        let faceColor = 'None';

        for (let line of lines) {
            if (line.startsWith('v ')) {
                /** @type {string[]} */
                let values = line.split(' ').slice(1);
                let xyz = values.map(value => parseFloat(value));
                // xyz.push(1);
                vertex.push(xyz);
                continue;
            }
            if (line.startsWith('f')) {
                let faces_ = line.split(' ').slice(1);
                let intFaces = faces_.map(face_ => parseInt(face_.split('/')[0]) - 1);
                intFaces.push(faceColor);
                faces.push(intFaces);
                continue;
            }
            if (line.startsWith('usemtl')) {
                faceColor = line.split(' ')[1];
            }
        }

        return {
            vert: vertex,
            face: faces
        }
    }

    #parseMtlFile(fileContent) {
        if (fileContent === "") {
            return {
                hasMtl: false,
                material: []
            }
        }
        let lines = fileContent.split('\n');
        const material = [];
        let totalMaterial = 0;
        let hasMtl = true;
        let faceColor = 'None';
        for (let line of lines) {
            if (line.startsWith("newmtl")) {
                faceColor = line.split(' ')[1]
                continue;
            }
            if (line.startsWith("Kd")) {
                let lineParts = line.split(' ');
                lineParts[0] =faceColor;
                material.push(lineParts);
            }
        }
        return material;
    }

}

