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
    lastKnownJson: any = {};
  
    constructor(private classificationService: ClassificationService) {}
  
    ngOnInit() {
        this.classificationService.getClassifications().subscribe(data => {
            this.json = data;
            this.lastKnownJson = JSON.parse(JSON.stringify(data)); // kopie bewaren
        });
    }
  
    onJsonChanged(updatedJson: any) {
        this.json = updatedJson;
    }
  
    save() {
        this.classificationService.saveClassifications(this.json).subscribe({
            next: (res) => {
            if (res.success) {
                console.log("Opgeslagen!");
                this.lastKnownJson = JSON.parse(JSON.stringify(this.json));
            } else {
                console.warn("Opslaan mislukt");
            }
            },
            error: (err) => {
                console.error("Fout bij opslaan:", err);
            }
        });
    }
}
