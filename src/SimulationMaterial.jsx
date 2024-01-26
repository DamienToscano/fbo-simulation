import simulationVertexShader from './simulationVertexShader.glsl';
import simulationFragmentShader from './simulationFragmentShader.glsl';
import * as THREE from "three";
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';

const getDataFromMeshWithSurfaceSampling = (size, mesh) => {
    const vertices = [];
    let sampler = new MeshSurfaceSampler(mesh).build();

    const particles_count = size * size;

    // Get all the points on the surface of the mesh
    for (let i = 0; i < particles_count; i++) {
        const vertex = new THREE.Vector3();
        sampler.sample(vertex);
        vertices.push(vertex.x, vertex.y, vertex.z);
    }

    const data = new Float32Array(particles_count * 4);

    let sample_position_index = 0;

    for (let particles_index = 0; particles_index < particles_count; particles_index++) {
        const cursor = particles_index * 4;

        data[cursor] = vertices[sample_position_index];
        sample_position_index++;
        data[cursor + 1] = vertices[sample_position_index];
        sample_position_index++; 
        data[cursor + 2] = vertices[sample_position_index];
        sample_position_index++; 
        data[cursor + 3] = 1.0; // This value is not usefull
    }

    return data;
}

class SimulationMaterial extends THREE.ShaderMaterial {
    constructor(size, mesh) {
        const positionsTexture = new THREE.DataTexture(
            getDataFromMeshWithSurfaceSampling(size, mesh),
            size,
            size,
            THREE.RGBAFormat,
            THREE.FloatType
        );
        positionsTexture.needsUpdate = true;

        const simulationUniforms = {
            positions: { value: positionsTexture },
            uFrequency: { value: 0.25 },
            uTime: { value: 0 },
        };

        super({
            uniforms: simulationUniforms,
            vertexShader: simulationVertexShader,
            fragmentShader: simulationFragmentShader,
        });
    }
}

export default SimulationMaterial;
