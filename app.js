body {
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    background-color: #f0f0f0;
    padding: 20px;
    box-sizing: border-box;
}

h1 {
    text-align: center;
    margin-bottom: 20px;
}

.contenedor-video {
    position: relative;
    width: 100%;
    max-width: 600px;
}

video {
    width: 100%;
    height: auto;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

#cambiar-camara {
    position: absolute;
    bottom: 10px;
    right: 10px;
    padding: 10px 20px;
    font-size: 1em;
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.7);
    border: none;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

#resultado {
    margin-top: 20px;
    font-size: 1.5em;
    color: #333;
    text-align: center;
}

@media (max-width: 600px) {
    body {
        padding: 10px;
    }
    
    h1 {
        font-size: 1.5em;
    }

    video {
        width: 100%;
        max-width: 100%;
    }

    #cambiar-camara {
        bottom: 5px;
        right: 5px;
        padding: 5px 10px;
        font-size: 0.9em;
    }
}
