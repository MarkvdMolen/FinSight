import { Component, OnInit } from '@angular/core';
import { JsonEditorComponent } from "./components/json-editor/json-editor.component";
import { ClassificationService } from '@shared/services/classification.service';
import { CommonModule } from '@angular/common';
import { ObjectWithObjectsIconComponent } from "@shared/components/object-with-objects-icon/object-with-objects-icon.component";

@Component({
  selector: 'app-classification-viewer',
  standalone: true,
  imports: [JsonEditorComponent, CommonModule, ObjectWithObjectsIconComponent],
  templateUrl: './classification-viewer.component.html',
  styleUrl: './classification-viewer.component.css'
})
export class ClassificationViewerComponent implements OnInit {

    json: any = {};
    lastKnownJson: any = {};
  
    constructor(private classificationService: ClassificationService) {}
  
    /**
     * Lifecycle hook that runs once the component has been initialized.
     * Fetches classification data from the server.
     */
    ngOnInit() {
        this.classificationService.getClassifications().subscribe(data => {
            this.json = data;
            this.lastKnownJson = JSON.parse(JSON.stringify(data));
        });
    }
  
    /**
     * Updates the JSON when changes are emitted from the editor component.
     *
     * @param updatedJson - The updated JSON object.
     */
    onJsonChanged(updatedJson: any) {
        this.json = updatedJson;
    }

    /**
     * Helper method that checks whether a given object has any keys.
     * To prevent the root component (<app-json-editor>) 
     * from rendering before the async json data is loaded (to avoid premature initialization issues)
     * 
     * @param obj - The object to check.
     * @returns True if the object has one or more keys; false otherwise.
     */
    hasKeys(obj: any): boolean {
        return obj && Object.keys(obj).length > 0;
    }      
    
    /**
     * Saves the current JSON to the server via the classification service.
     * On success, updates the last known JSON snapshot.
     */
    save() {
        this.classificationService.saveClassifications(this.json).subscribe({
            next: (res) => {
            if (res.success) {
                console.log("Opgeslagen!"); // Change to component pop up
                this.lastKnownJson = JSON.parse(JSON.stringify(this.json));
            } else {
                console.warn("Opslaan mislukt"); // Change to component pop up
            }
            },
            error: (err) => {
                console.error("Fout bij opslaan:", err); // Change to component pop up
            }
        });
    }
}
