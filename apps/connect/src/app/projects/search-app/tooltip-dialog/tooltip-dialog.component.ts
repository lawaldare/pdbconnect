import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: "tooltip-dialog",
    templateUrl: "./tooltip-dialog.component.html",
    styleUrls: ["./tooltip-dialog.component.css"],
    standalone: false
})
export class TooltipDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any) {}

  ngOnInit() {}
}
