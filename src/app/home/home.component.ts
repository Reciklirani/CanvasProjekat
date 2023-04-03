import { Component, ElementRef, ViewChild } from '@angular/core';
import { Point } from '../models/point.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @ViewChild('canvas', { static: true }) myCanvas!: ElementRef;
  public clickedPoints: Point[] = []
  flag: boolean = false;
  numberOfPoints: number = 0;
  canvas!: HTMLCanvasElement;
  context!: CanvasRenderingContext2D | null;
  inputValue = 0;
  concav: boolean = false;
  convex: boolean = false;

  ngOnInit(): void {
    this.canvas = this.myCanvas.nativeElement;
    if (this.context) {
      this.context = this.canvas.getContext('2d');
    }
  }

  // collects coordinates, draws a dot, and draws a line
  public collectAndDraw(event: any) {
    const context = this.canvas.getContext("2d");
    let point: Point = {
      x: 0,
      y: 0
    };
    point.x = event.offsetX;
    point.y = event.offsetY;

    console.log(point);
    if (this.numberOfPoints < this.inputValue) {
      this.numberOfPoints++;
    } else {
      if (this.pointInPolygon(point, this.clickedPoints, this.inputValue)) {
        console.log("UNUTAR")
        if (context !== null) {
          context.fillStyle = "green"
        }
        context?.fillRect(point.x - 3, point.y - 3, 6, 6);
      } else {
        console.log("VAN");
        if (context !== null) {
          context.fillStyle = "red"
        }
        context?.fillRect(point.x - 3, point.y - 3, 6, 6,);
      }
      return
    }

    if (this.clickedPoints.length == 0) {
      context?.beginPath();
      context?.moveTo(point.x, point.y);
      context?.fillRect(point.x - 3, point.y - 3, 6, 6);

    } else {
      context?.lineTo(point.x, point.y);
      context?.fillRect(point.x - 3, point.y - 3, 6, 6);
      context?.stroke();
    }

    this.clickedPoints.push(point);
    if (this.numberOfPoints === this.inputValue) {
      context?.closePath();
      context?.stroke();

      let pointsArr: any[] = [];
      this.clickedPoints.forEach((point: Point) => {
        pointsArr.push([point.x, point.y])
      })

    console.log(this.checkIfConvex(pointsArr) ? "KONVEKSAN" : "KONKAVAN");
    }
  }

  public checkIfConvex(arr: any[][]) {
    const { length } = arr;
    let pre = 0, curr = 0;
    for (let i = 0; i < length; ++i) {
      let dx1 = arr[(i + 1) % length][0] - arr[i][0];
      let dx2 = arr[(i + 2) % length][0] - arr[(i + 1) % length][0];
      let dy1 = arr[(i + 1) % length][1] - arr[i][1];
      let dy2 = arr[(i + 2) % length][1] - arr[(i + 1) % length][1];
      curr = dx1 * dy2 - dx2 * dy1;
      if (curr != 0) {
        if ((curr > 0 && pre < 0) || (curr < 0 && pre > 0)) {
          this.refreshCanvas();
          this.concav = true;
          this.convex = false;
          return true;
        }
        else {
          pre = curr;
        }
      };
    };
    this.concav = false;
    this.convex = true;
    return false;
  }

  public pointInPolygon(point: Point, polygon: Point[], numVertices: number) {
    var i, j = numVertices - 1;
    var inPoly = false;

    for (i = 0; i < numVertices; i++) {
      if (((polygon[i].y < point.y && polygon[j].y >= point.y)
        || (polygon[j].y < point.y && polygon[i].y >= point.y))
        && (polygon[i].x <= point.x || polygon[j].x <= point.x)) {
        if (polygon[i].x + (point.y - polygon[i].y) / (polygon[j].y - polygon[i].y) * (polygon[j].x - polygon[i].x) < point.x) {
          inPoly = !inPoly;
        }
      }
      j = i;
    }
    return inPoly;
  }

  public refreshCanvas() {
    let canvas: HTMLCanvasElement = this.myCanvas.nativeElement;
    let context = canvas.getContext('2d');
    this.clickedPoints.length = 0;
    this.numberOfPoints = 0;
    context?.clearRect(0, 0, 600, 600);
    this.concav = false;
    this.convex = false;
    if (context !== null) {
      context.fillStyle = "black"
    }
  }
}

