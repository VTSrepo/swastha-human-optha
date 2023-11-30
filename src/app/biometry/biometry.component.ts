import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BiometryService } from './biometry.service';
import { InfoDialogComponent } from '../utilities/info-dialog/info-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UtilityService } from '../utilities/services/utility.service';

@Component({
  selector: 'app-biometry',
  templateUrl: './biometry.component.html',
  styleUrls: ['./biometry.component.scss']
})
export class BiometryComponent {

  @Input() headerDetail: any;
  @Input() visit_no: string = '';
  @Input() visit_date: any;
  @Output() isActiveBiometry = new EventEmitter();
  biometricForm!: FormGroup;
  biometryBoolean:boolean = false;
  showPreviousTable:boolean = false;
  biometryDetailData: any = [];
  showVisitDate: any;
  showVisitNo: any;
  prevCounter = 0;
  recordIndex: number | undefined;

  constructor(
    private dialog: MatDialog,
    private utility: UtilityService,
    private formBuilder: FormBuilder,
    private bioService: BiometryService,
  ) {}

  ngOnInit(): void {

    this.biometricForm = this.formBuilder.group({
      keratometry_k1_re: [],
      keratometry_k1_le: [],
      keratometry_k2_re: [],
      keratometry_k2_le: [],
      axial_length_re: [],
      axial_length_le: [],
      iolpower1_re: [],
      iolpower1_le: [],
      iolpower2_re: [],
      iolpower2_le: [],
      iolpower3_re: [],
      iolpower3_le: [],
      iolpower1_re_rem: [],
      iolpower1_le_rem: [],
      iolpower2_re_rem: [],
      iolpower2_le_rem: [],
      iolpower3_re_rem: [],
      iolpower3_le_rem: []
    })
  }

  saveBiomtery() {
    const bioForm = this.biometricForm.controls;
    let params = {
      "org_id": localStorage.getItem('org_id'),
      "branch_id": localStorage.getItem('branch_id'),
      "user_id": localStorage.getItem('user_id'),
      "patient_id": this.headerDetail.patient_id,
      "visit_no": this.visit_no,
      "visit_date": this.visit_date,
      "keratometry_k1_re": bioForm.keratometry_k1_re.value,
      "keratometry_k1_le": bioForm.keratometry_k1_le.value,
      "keratometry_k2_re": bioForm.keratometry_k2_re.value,
      "keratometry_k2_le": bioForm.keratometry_k2_le.value,
      "axial_length_re": bioForm.axial_length_re.value,
      "axial_length_le": bioForm.axial_length_le.value,
      "iolpower1_re": bioForm.iolpower1_re.value,
      "iolpower1_le": bioForm.iolpower1_le.value,
      "iolpower1_re_rem": bioForm.iolpower1_re_rem.value,
      "iolpower1_le_rem": bioForm.iolpower1_le_rem.value,
      "iolpower2_re": bioForm.iolpower2_re.value,
      "iolpower2_le": bioForm.iolpower2_le.value,
      "iolpower2_re_rem": bioForm.iolpower2_re_rem.value,
      "iolpower2_le_rem": bioForm.iolpower2_le_rem.value,
      "iolpower3_re": bioForm.iolpower3_re.value,
      "iolpower3_le": bioForm.iolpower3_le.value,
      "iolpower3_re_rem": bioForm.iolpower3_re_rem.value,
      "iolpower3_le_rem": bioForm.iolpower3_le_rem.value,
    }
    this.bioService.createBio(params).subscribe(data => {
      console.log(data);
      this.biometryBoolean = true;
      this.emitBio();
      this.dialog.open(InfoDialogComponent, {
        width: '400px',
        data: 'Biometry Saved Successfully!!!'
      })
    })
  }

  getGlassDetail() {
    const patient_id = this.headerDetail.patient_id;
    this.bioService.getBio(patient_id).subscribe(data => {
      console.log('getBio Data',data);
      this.biometryDetailData = data.results;
      this.biometryDetailData = this.biometryDetailData.reverse();
      this.setCurrentObjectData();
    })
  }

  emitBio() {
    this.isActiveBiometry.emit(
      this.biometryBoolean
    );
  }

  setCurrentObjectData() {
    this.biometricForm.patchValue(this.biometryDetailData[this.getLastRecordIndex()]);
    this.showVisitNo = this.biometryDetailData[this.getLastRecordIndex()].visit_no;
    this.showVisitDate = this.utility.convertDate(
      this.biometryDetailData[this.getLastRecordIndex()].visit_date
    );
    if (this.getLastRecordIndex() <= 0) {
      this.recordIndex = 0;
    }
  }

  getLastRecordIndex() {
    return this.biometryDetailData.length - 1;
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
    this.biometricForm.patchValue(this.biometryDetailData[this.recordIndex]);
  }

  displayPrevious() {
    this.showPreviousTable = true;
    this.getGlassDetail();
  }

  back() {
    this.showPreviousTable = false;
    this.addRecord();
  }

  addRecord() {
    this.biometricForm.reset();
  }

  rightToLeft() {
    this.biometricForm.controls.keratometry_k1_le.setValue(this.biometricForm.controls.keratometry_k1_re.value);
    this.biometricForm.controls.keratometry_k2_le.setValue(this.biometricForm.controls.keratometry_k2_re.value);
    this.biometricForm.controls.axial_length_le.setValue(this.biometricForm.controls.axial_length_re.value);
    this.biometricForm.controls.iolpower1_le.setValue(this.biometricForm.controls.iolpower1_re.value);
    this.biometricForm.controls.iolpower2_le.setValue(this.biometricForm.controls.iolpower2_re.value);
    this.biometricForm.controls.iolpower3_le.setValue(this.biometricForm.controls.iolpower3_re.value);
    this.biometricForm.controls.iolpower1_le_rem.setValue(this.biometricForm.controls.iolpower1_re_rem.value);
    this.biometricForm.controls.iolpower2_le_rem.setValue(this.biometricForm.controls.iolpower2_re_rem.value);
    this.biometricForm.controls.iolpower3_le_rem.setValue(this.biometricForm.controls.iolpower3_re_rem.value);
  }

  leftToRight() {
    this.biometricForm.controls.keratometry_k1_re.setValue(this.biometricForm.controls.keratometry_k1_le.value);
    this.biometricForm.controls.keratometry_k2_re.setValue(this.biometricForm.controls.keratometry_k2_le.value);
    this.biometricForm.controls.axial_length_re.setValue(this.biometricForm.controls.axial_length_le.value);
    this.biometricForm.controls.iolpower1_re.setValue(this.biometricForm.controls.iolpower1_le.value);
    this.biometricForm.controls.iolpower2_re.setValue(this.biometricForm.controls.iolpower2_le.value);
    this.biometricForm.controls.iolpower3_re.setValue(this.biometricForm.controls.iolpower3_le.value);
    this.biometricForm.controls.iolpower1_re_rem.setValue(this.biometricForm.controls.iolpower1_le_rem.value);
    this.biometricForm.controls.iolpower2_re_rem.setValue(this.biometricForm.controls.iolpower2_le_rem.value);
    this.biometricForm.controls.iolpower3_re_rem.setValue(this.biometricForm.controls.iolpower3_le_rem.value);
  }
}
