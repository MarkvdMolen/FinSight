import { Component } from '@angular/core';
import { JsonEditorComponent } from "./components/json-editor/json-editor.component";

@Component({
  selector: 'app-classification-viewer',
  standalone: true,
  imports: [JsonEditorComponent],
  templateUrl: './classification-viewer.component.html',
  styleUrl: './classification-viewer.component.css'
})
export class ClassificationViewerComponent {

}
