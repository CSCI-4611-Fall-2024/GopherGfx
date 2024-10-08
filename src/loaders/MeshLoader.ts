import { Mesh3 } from '../geometry/3d/Mesh3'
import { Node3 } from '../core/Node3'
import { GfxApp } from '../core/GfxApp'
import { MeshParser } from './MeshParser'
import { Document, WebIO } from '@gltf-transform/core';

export class MeshLoader
{
    /**
     * Loads a GLTF file asynchronously. 
     * 
     * @param filename - The relative path to the file
     * @param callback - An optional callback that is called when the file has been loaded
     * @returns A new Node3 object that will act as the root of the model
     * once it is finished loading.  Note, it will only contain
     * the model data AFTER the asynchronous loading is complete.
     */  
    static loadGLTF(filename: string, callback: ((rootNode: Node3) => void) | null = null, recursive = true): Node3
    {

        GfxApp.getInstance().assetManager.requestedAssets.push(filename);

        const root = new Node3();

        const io = new WebIO();
        io.read(filename).then((document: Document) => {
            
            MeshParser.parseGLTF(document, root);
            if(callback)
            {
                callback(root);
            }
            GfxApp.getInstance().assetManager.loadedAssets.push(filename);

        })
        .catch(() => {
            GfxApp.getInstance().assetManager.errorAssets.push(filename);
            console.error('Unable to fetch GLTF file: ' + filename);
        });

        return root;
    }

    /**
     * Loads an OBJ file asynchronously
     * 
     * @param filename - The relative path to the OBJ file
     * @param callback - An optional callback that is called when the file has been loaded
     * @returns The Mesh3 object created to hold the model. Note, it will only contain
     * the model data AFTER the asynchronous loading is complete.
     */  
    static loadOBJ(filename: string, callback: ((loadedMesh: Mesh3) => void) | null = null): Mesh3
    {
        GfxApp.getInstance().assetManager.requestedAssets.push(filename);

        const mesh = new Mesh3();

        fetch(filename).then((response: Response) => {
            if(!response.ok)
                throw new Error();
            return response.blob();
        })
        .then((data: Blob) => {
            data.text().then((text: string) => {

                MeshParser.parseOBJ(text, mesh);
                if(callback)
                {
                    callback(mesh);
                }
                GfxApp.getInstance().assetManager.loadedAssets.push(filename);

            });
        })
        .catch(() => {
            GfxApp.getInstance().assetManager.errorAssets.push(filename);
            console.error('Unable to load OBJ file: ' + filename);
        });

        return mesh;
    }

    /**
     * Loads a PLY file asynchronously
     * 
     * @param filename - The relative path to the PLY file
     * @param callback - An optional callback that is called when the file has been loaded
     * @returns The Mesh3 object created to hold the model. Note, it will only contain
     * the model data AFTER the asynchronous loading is complete.
     */  
    static loadPLY(filename: string, callback: ((loadedMesh: Mesh3) => void) | null = null): Mesh3
    {
        GfxApp.getInstance().assetManager.requestedAssets.push(filename);

        const mesh = new Mesh3();

        fetch(filename).then((response: Response) => {
            if(!response.ok)
                throw new Error();
            return response.blob();
        })
        .then((data: Blob) => {
            data.arrayBuffer().then((buffer: ArrayBuffer) => {

                MeshParser.parsePLY(buffer, mesh);
                if(callback)
                {
                    callback(mesh);
                }
                GfxApp.getInstance().assetManager.loadedAssets.push(filename);

            });
        })
        .catch(() => {
            GfxApp.getInstance().assetManager.errorAssets.push(filename);
            console.error('Unable to load PLY file: ' + filename);
        });

        return mesh;
    }
}