import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UtilityService } from '../utilities/services/utility.service';
import { ReferenceService } from '../utilities/services/reference.service';
import { InfoDialogComponent } from '../utilities/info-dialog/info-dialog.component';
import { PetDiagnosisService } from './pet-diagnosis.service';

@Component({
  selector: 'app-pet-diagnosis',
  templateUrl: './pet-diagnosis.component.html',
  styleUrls: ['./pet-diagnosis.component.scss']
})
export class PetDiagnosisComponent {

  @Input() headerDetail: any;
  @Input() visit_no: string = '';
  @Input() visit_date: any;
  @Input() aptObj: any = {};
  @Output() isActivePetDiagnosis = new EventEmitter();
  diagnosisForm!: FormGroup;
  diagnosisBoolean: boolean = false;
  isActiveDiagnosis: any;
  showPreviousTable:boolean = false;
  diagnosisDetailData: any = [];
  prevCounter = 0;
  recordIndex: number | undefined;
  showVisitDate: any;
  showVisitNo: any;
  filesList: any = [];
  showFiles = false;
  imageSrc: any = '';
  videoSrc: any = '';

  constructor(private router: Router,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private utility: UtilityService,
    private ref: ReferenceService,
    private diagnosisService: PetDiagnosisService) {}

  ngOnInit(): void {

    this.diagnosisForm = this.formBuilder.group({
      tentative_diag: [], 
      confirm_diag: [],   
      direct_opthol: [], 
      indirect_opthol: [],
      diagnostic_agent: [],
      advise: []          
    })
  }

  saveDiagnosis() {
    const diagnosisForm = this.diagnosisForm.controls;
    let params = {
        org_id: localStorage.getItem('org_id'),
        branch_id: localStorage.getItem('branch_id'),
        patient_id: this.headerDetail.patient_id,
        user_id: localStorage.getItem('user_id'),
        dept_id: this.aptObj.dept_id,
        visit_no: this.visit_no,
        visit_date: this.visit_date,
        tentative_diag: diagnosisForm.tentative_diag.value, 
        confirm_diag: diagnosisForm.confirm_diag.value,   
        direct_opthol: diagnosisForm.direct_opthol.value, 
        indirect_opthol: diagnosisForm.indirect_opthol.value,
        diagnostic_agent: diagnosisForm.diagnostic_agent.value,
        advise: diagnosisForm.advise.value 
      };
    this.diagnosisService.submitDiagnosis(params).subscribe((data) => {
      console.log(data);
      this.diagnosisBoolean = true;
      this.emitDiagnosis();
      this.dialog.open(InfoDialogComponent, {
        width: '500px',
        data: 'Diagnosis Saved Successfully',
      });
    });
  }

  emitDiagnosis() {
    this.isActivePetDiagnosis.emit(
      [this.diagnosisBoolean, this.visit_no]
    );
  }

  back() {
    this.showPreviousTable = false;
    this.resetDiagnosis();
    this.recordIndex = undefined;
  }

  resetDiagnosis() {
    this.diagnosisForm.reset();
  }

  getDiagnosisDetail() {
    const patient_id = this.headerDetail.patient_id;
    this.diagnosisService.getDiagnosis(patient_id).subscribe(data => {
      console.log('Diagnosis Data',data);
      this.diagnosisDetailData = data.results;
      this.diagnosisDetailData = this.diagnosisDetailData.reverse();
      this.setCurrentObjectData();
    })
  }

  setCurrentObjectData() {
    this.diagnosisForm.patchValue(this.diagnosisDetailData[this.getLastRecordIndex()]);
    this.showVisitNo = this.diagnosisDetailData[this.getLastRecordIndex()].visit_no;
    this.showVisitDate = this.utility.convertDate(
      this.diagnosisDetailData[this.getLastRecordIndex()].visit_date
    );
    if (this.getLastRecordIndex() <= 0) {
      this.recordIndex = 0;
    }
  }

  getLastRecordIndex() {
    return this.diagnosisDetailData.length - 1;
  }

  prevItem() {
    this.prevCounter++;
    this.setCurrentNotesAfterChange();
  }

  nextItem() {
    this.prevCounter--;
    this.setCurrentNotesAfterChange();
  }

  setCurrentNotesAfterChange() {
    this.recordIndex = this.getLastRecordIndex() - this.prevCounter;
    this.diagnosisForm.patchValue(this.diagnosisDetailData[this.recordIndex]);
    this.showVisitNo = this.diagnosisDetailData[this.recordIndex].visit_no;
    this.showVisitDate = this.diagnosisDetailData[this.recordIndex].visit_date;
  }

  displayPrevious() {
    this.showPreviousTable = true;
    this.getDiagnosisDetail();
  }

  view(path: any) {
    this.videoSrc = '';
    this.imageSrc = '';
    if (path.indexOf('pdf') >= 0) {
      window.open(path, '_blank');
    }
    if (path.indexOf('.mp4') >= 0) {
      this.videoSrc = path;
    } else {
      this.imageSrc = path;      
    }
  }
  retrieveFiles() {
    this.showFiles = true;
    this.filesList = [];
    this.ref
      .getFiles(this.headerDetail.patient_id, 'Diagnosis')
      .subscribe((data:any) => {
        let temp = data;
        for (let i = 0; i < temp.length; i++) {
          let tempObj = { fileName: '', filePath: '' };
          tempObj.fileName = temp[i].split('/')[4];
          tempObj.filePath = temp[i];
          this.filesList.push(tempObj);
        }
      });
  }
}
