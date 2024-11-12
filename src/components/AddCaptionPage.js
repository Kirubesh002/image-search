import React, { useState, useRef, useEffect } from "react";
import * as fabric from "fabric";
import "./AddCaptionPage.css";

function AddCaptionPage({ imageUrl, closeModal }) {
  const [caption, setCaption] = useState("");
  const canvasRef = useRef(null);
  const canvasInstance = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      // Initialize the fabric canvas
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: 500,
        height: 500,
        backgroundColor: "#f0f0f0",
      });
      canvasInstance.current = canvas;

      // Load image with cross-origin handling
      const imgElement = new Image();
      imgElement.crossOrigin = "anonymous";
      imgElement.src = imageUrl;

      imgElement.onload = () => {
        try {
          const img = new fabric.Image(imgElement, {
            left: 0,
            top: 0,
            scaleX: canvas.width / imgElement.width,
            scaleY: canvas.height / imgElement.height,
          });
          canvas.clear();
          canvas.add(img);
          canvas.sendToBack(img);
          canvas.renderAll();
        } catch (imageLoadError) {
          console.error("Error adding image to canvas:", imageLoadError);
        }
      };

      imgElement.onerror = () => {
        console.error("Failed to load image.");
      };
    } catch (canvasError) {
      console.error("Error initializing canvas:", canvasError);
    }

    // Cleanup on unmount
    return () => {
      if (canvasInstance.current) {
        canvasInstance.current.dispose();
        canvasInstance.current = null;
      }
    };
  }, [imageUrl]);

  const addCaptionToImage = () => {
    try {
      const canvas = canvasInstance.current;
      if (!canvas) throw new Error("Canvas not initialized.");

      const text = new fabric.Text(caption, {
        left: 50,
        top: 50,
        fontSize: 20,
        fill: "#fff",
      });
      canvas.add(text);
      canvas.renderAll();
    } catch (captionError) {
      console.error("Error adding caption:", captionError);
      alert("Failed to add caption. Please try again.");
    }
  };

  const downloadImage = () => {
    try {
      const canvas = canvasInstance.current;
      if (!canvas) throw new Error("Canvas not initialized.");

      const dataUrl = canvas.toDataURL({ format: "png" });
      if (!dataUrl) throw new Error("Failed to generate image data URL.");

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "customized-image.png";
      link.click();
    } catch (downloadError) {
      console.error("Error downloading image:", downloadError);
    }
  };

  const drawCircle = () => {
    try {
      const canvas = canvasInstance.current;
      if (!canvas) throw new Error("Canvas not initialized.");

      // Create a circle shape
      const circle = new fabric.Circle({
        radius: 50,
        left: 100,
        top: 100,
        fill: "blue", // Circle color
        selectable: true,
      });
      canvas.add(circle);
      canvas.renderAll();
    } catch (circleError) {
      console.error("Error drawing circle:", circleError);
    }
  };

  const polygonControls = () => {
    const canvas = canvasInstance.current;
    const points = [
      {
        x: 3,
        y: 4,
      },
      {
        x: 16,
        y: 3,
      },
      {
        x: 30,
        y: 5,
      },
      {
        x: 25,
        y: 55,
      },
      {
        x: 19,
        y: 44,
      },
      {
        x: 15,
        y: 30,
      },
      {
        x: 15,
        y: 55,
      },
      {
        x: 9,
        y: 55,
      },
      {
        x: 6,
        y: 53,
      },
      {
        x: -2,
        y: 55,
      },
      {
        x: -4,
        y: 40,
      },
      {
        x: 0,
        y: 20,
      },
    ];

    const poly = new fabric.Polygon(points, {
      left: 200,
      top: 50,
      fill: "yellow",
      strokeWidth: 1,
      stroke: "grey",
      scaleX: 5,
      scaleY: 5,
      objectCaching: false,
      transparentCorners: false,
      cornerColor: "blue",
    });
    canvas.viewportTransform = [0.7, 0, 0, 0.7, -50, 50];
    canvas.add(poly);

    let editing = false;
    poly.on("mousedblclick", () => {
      editing = !editing;
      if (editing) {
        poly.cornerStyle = "circle";
        poly.cornerColor = "rgba(0,0,255,0.5)";
        poly.hasBorders = false;
        poly.controls = fabric.controlsUtils.createPolyControls(poly);
      } else {
        poly.cornerColor = "blue";
        poly.cornerStyle = "rect";
        poly.hasBorders = true;
        poly.controls = fabric.controlsUtils.createObjectDefaultControls();
      }
      poly.setCoords();
      canvas.requestRenderAll();
    });
  };

  const handleClose = () => {
    closeModal();
  };

  return (
    <div className="caption-page">
      <div className="caption-content">
        <button className="close-btn" onClick={handleClose}>
          ×
        </button>
        <div className="caption-canva-content">
          <canvas ref={canvasRef}></canvas>
          <div className="caption-editing-content">
            <input
              type="text"
              placeholder="Enter Caption"
              className="caption-input"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />{" "}
            <br />
            <button className="save-caption-btn" onClick={addCaptionToImage}>
              Add Caption
            </button>
            <button className="draw-circle-btn" onClick={drawCircle}>
              Draw Circle
            </button>
            <button className="poly-btn" onClick={polygonControls}>
              polygonControls
            </button>
            <button className="download-btn" onClick={downloadImage}>
              Download Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCaptionPage;
