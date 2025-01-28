import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.172.0/build/three.module.js';

function main() {
    //general settings(renderer, camera, scene etc.)
    const canvas = document.querySelector('#canvas');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
    const field_of_view = 75;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 75;
    const camera = new THREE.PerspectiveCamera(field_of_view, aspect, near, far);
    camera.position.z = 10;
    camera.position.y = 5;
    const scene = new THREE.Scene();

    //array for storing all points added to the scene
    const points = [];

    //getting cursor coordinates
    const cursor_position = (event) => {//getting pointer
        let mouse = new THREE.Vector2();
        mouse.set(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1,
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const direction = raycaster.ray.direction.clone();
        const pointClick = raycaster.ray.origin.clone().add(direction.multiplyScalar(4));
    return pointClick;
    }

    //Event listener to handle on click event
    canvas.addEventListener("click", (event) => {
        const pointClick = cursor_position(event);
        //creating and adding point to the scene
        const dotGeometry = new THREE.BufferGeometry();
        dotGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [pointClick.x, pointClick.y, pointClick.z], 3 ) );
        const dotMaterial = new THREE.PointsMaterial( { size: 0.6, color: 0x00ff00 } );
        const dot = new THREE.Points( dotGeometry, dotMaterial);
        scene.add(dot);
        //creating and adding line(edge) between each two points to the scene
        //realised by adding line(edge) from new point to all another
        for(let i = 0; i < points.length; i++) {
                const current_points = [];
                current_points.push(new THREE.Vector3(pointClick.x, pointClick.y, pointClick.z));
                current_points.push(points[i]);
                const material = new THREE.LineBasicMaterial( { color: 0x00ff00 } );
                const geometry = new THREE.BufferGeometry().setFromPoints( current_points );
                const line = new THREE.Line( geometry, material );
                scene.add(line);

        }
        //adding new point to the array of all points
        points.push(new THREE.Vector3(pointClick.x, pointClick.y, pointClick.z));
    })

    //rotation animation
    function render(time = 1) {
        time *= 0.001;
        camera.rotation.z = time;
        renderer.render(scene, camera);
        requestAnimationFrame(render);

}
    requestAnimationFrame(render);}
main();


