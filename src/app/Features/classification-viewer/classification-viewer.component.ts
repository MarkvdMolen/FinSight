import { Component, OnInit } from '@angular/core';
import { JsonEditorComponent } from "./components/json-editor/json-editor.component";
import { ClassificationService } from '@shared/services/classification.service';

@Component({
  selector: 'app-classification-viewer',
  standalone: true,
  imports: [JsonEditorComponent],
  templateUrl: './classification-viewer.component.html',
  styleUrl: './classification-viewer.component.css'
})
export class ClassificationViewerComponent implements OnInit {

    json: any = {};
    constructor(private classificationService: ClassificationService) {}

    ngOnInit() {
        this.classificationService.getClassifications().subscribe(data => {
            this.json = data;
        });
    }

}
