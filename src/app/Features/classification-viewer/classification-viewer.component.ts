import { Component } from '@angular/core';
import { JsonEditorComponent } from "./components/json-editor/json-editor.component";
import classificationStructure from '../../../../public/classifications.json';

@Component({
  selector: 'app-classification-viewer',
  standalone: true,
  imports: [JsonEditorComponent],
  templateUrl: './classification-viewer.component.html',
  styleUrl: './classification-viewer.component.css'
})
export class ClassificationViewerComponent {

    // NEEDS A TYPE BUT JSON IS DYNAMIC BECAUSE WE WILL BE EDITING IT
    classificationStructureJson = classificationStructure

}
