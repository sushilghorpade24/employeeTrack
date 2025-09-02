import { Component, inject, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import {AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { EmployeeService } from '../core/services/employee/employee.service'; 
import { CommonModule } from '@angular/common'; 
import { AutoErrorDirective } from '../directives/auto-error.directive';
import { ActivatedRoute } from '@angular/router';
import { DatePickerModule } from 'primeng/datepicker';
// import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-edit-emp',
  imports: [ButtonModule,StepperModule,ReactiveFormsModule,CommonModule,DatePickerModule],
  templateUrl: './edit-emp.component.html',
  styleUrl: './edit-emp.component.css'
})
export class EditEmpComponent {

  personalDetail:any[]=[];
  formData:any;
  employeeService=inject(EmployeeService);
  employeeForm: FormGroup = new FormGroup({});
  step = 1;
  masterData: any;
  companyList: any []= [];
  validationErrors: string[] = [];
  editId:number = 0;
  isApiSucces: boolean = false;
  date:Date|undefined;
  minDate:Date | undefined;
  
  constructor(private fb: FormBuilder,private activateRoute: ActivatedRoute) {
    this.activateRoute.params.subscribe((res:any)=>{
      this.editId  = res.id;
      if(this.editId !=0) {
        this.getEmpBYId();
      } 
    })
    
  };

  onStateChange(){
    if(this.employeeForm &&  this.employeeForm.controls['contactFamily']) {
      const state =  this.employeeForm.controls['contactFamily'] as FormGroup;
    
      if( state.controls['state']) {
        const stateVal = state.controls['state'].value;
        return this.masterData['district'].filter((m:any)=>m.parentMasterId == stateVal)
      } else {
        return  []
      }
      
    }
    
  }
  nextStep() {
    const currentGroup = this.getStepGroup();
    if (currentGroup.valid) {
      this.validationErrors = [];
      this.step++;
    } else {
      this.validationErrors = this.getValidationErrors(currentGroup);
      currentGroup.markAllAsTouched();
    }
  }

  getEmpBYId( ){
    this.employeeService.getEmployeeById(this.editId).subscribe({
      next: (response) => {
       const EmpData =  response;
      this.employeeForm = this.fb.nonNullable.group({
        personalInfo: this.fb.group({
          payCode: [EmpData.payCode],
          aadharNo:[EmpData.aadharNo, [Validators.required,Validators.pattern(/^[2-9]{1}[0-9]{11}$/)]],
          cardNo:[EmpData.cardNo],
          postAppliedFor:[EmpData.postAppliedFor,Validators.required],
          designation:[EmpData.designation,Validators.required],
          entryDate:[EmpData.entryDate],
          fullName:[EmpData.fullName,Validators.required],
          department:[EmpData.department,Validators.required],
          subDepartment:[EmpData.subDepartment,Validators.required],
          fatherOrHusbandName:[EmpData.fatherOrHusbandName,Validators.required],
          division:[EmpData.division,Validators.required],
          category:[EmpData.category,Validators.required],
          motherName:[EmpData.motherName],
          dateOfBirth:[formatDate(EmpData.dateOfBirth,'yyyy-MM-dd','en')],
          age:[EmpData.age,Validators.required],
          maritalStatus:[EmpData.maritalStatus,Validators.required],
          gender:[EmpData.gender,Validators.required],
          nationality:[EmpData.nationality],
          religion:[EmpData.religion],
          caste:[EmpData.caste],
          region:[EmpData.region],
          identityMark:[EmpData.identityMark],
          shiftType:[EmpData.shiftType,Validators.required],
          shiftOption:[EmpData.shiftOption,Validators.required],
          weight:[EmpData.weight],
          bloodGroup:[EmpData.bloodGroup],
          employerLiability : [EmpData.employerLiability],
          reportingDate:[formatDate(EmpData.reportingDate,'yyyy-MM-dd','en')],
          transferFrom:[EmpData.transferFrom],
          transferTo:[EmpData.transferTo],
          transferDate:[formatDate(EmpData.transferDate,'yyyy-MM-dd','en')],
          appointmentMonths:[EmpData.appointmentMonths],
          bankAccountNo:[EmpData.bankAccountNo],
          bankName:[EmpData.bankName],
          bankIfscCode:[EmpData.bankIfscCode],
          bankBranch:[EmpData.bankBranch],
          costCentre:[EmpData.entryDate ? new Date(EmpData.entryDate) : null],
          panCardNo:[EmpData.panCardNo, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)],
          pfUanNo:[EmpData.pfUanNo],
          workerLwfNo:[EmpData.workerLwfNo],
          cadre:[EmpData.cadre,Validators.required],
          company:[EmpData.company,Validators.required],
          location:[EmpData.location],
          rlBand:[EmpData.rlBand,Validators.required],
        }),
  
        contactFamily: this.fb.group({ 
          presentAddress:[EmpData.presentAddress,Validators.required],
          permanentAddress:[EmpData.permanentAddress,Validators.required],
          state:[EmpData.state],
          subDivision: [EmpData.subDivision],
          district:[EmpData.district],
          phone1:[EmpData.phone1], // Starts with 6-9 and has exactly 10 digits
          whatsappNo:[EmpData.whatsappNo],
          pincode:[EmpData.pincode],
          email:[EmpData.email],
          employeeFamilyMembers:this.fb.array([])
        }),
        qualificationExpe: this.fb.group({
          qualification: [EmpData.qualification],
          technicalQualification:[EmpData.technicalQualification],
          languagesKnown:[EmpData.languagesKnown],
          totalExperienceYears:[EmpData.totalExperienceYears],
          employeeExperiences:this.fb.array([]) 
        }),
        
        additionalInfo: this.fb.group({
          relativeWorkingInCompany: [EmpData.relativeWorkingInCompany],
          relativeName: [EmpData.relativeName],
          relativeRelationship: [EmpData.relativeRelationship],
          entryDate: [EmpData.entryDate? new Date(EmpData.entryDate) : null],
         
          interviewDate: [EmpData.interviewDate],
          interviewedBy: [ EmpData.interviewedBy],
          approvedBy: [EmpData.approvedBy],
          dateOfJoining: [EmpData.dateOfJoining],
          salary: [EmpData.salary],
          confirmDate: [EmpData.confirmDate],
          employmentStatus: [EmpData.employmentStatus],
          individualBioData: [EmpData.individualBioData],
          photoAttached: [EmpData.photoAttached],
          applicationAttached: [EmpData.applicationAttached],
          certificatesAttached: [EmpData.certificatesAttached],
          contractAttached: [EmpData.contractAttached],
          joiningReportAttached: [EmpData.joiningReportAttached],
          nominationFormAttached: [EmpData.nominationFormAttached],
          proofOfAge: [EmpData.proofOfAge],
          proofName: [EmpData.proofName],
        }),
        salaryPayroll: this.fb.group({
          transportFacility: [EmpData.transportFacility],
          routeNo: [EmpData.routeNo],
          actualCtc: [EmpData.actualCtc],
          basicSalary: [EmpData.basicSalary],
          hra: [EmpData.hra],
          conveyanceAllowance: [EmpData.conveyanceAllowance],
          otherAllowance: [EmpData.otherAllowance],
          medicalAllowance: [EmpData.medicalAllowance],
          attendanceIncentive: [EmpData.attendanceIncentive],
          grossSalary: [EmpData.grossSalary],
          pfEmployee: [EmpData.pfEmployee],
          esiEmployee: [EmpData.esiEmployee],
          lwfEmployee: [EmpData.lwfEmployee],
          totalDeduction: [EmpData.totalDeduction],
          pfEmployer: [EmpData.pfEmployer],
          esiEmployer: [EmpData.esiEmployer],
          lwfEmployer: [EmpData.lwfEmployer],
          salaryBonus: [EmpData.salaryBonus],
          exgratia: [EmpData.exgratia],
          subTotalCtc: [EmpData.subTotalCtc],
          employerLiability: [EmpData.employerLiability],
          employeeType: [EmpData.employeeType,Validators.required],
          wageCalculationType: [EmpData.wageCalculationType,Validators.required],
          paymentType: [EmpData.paymentType,Validators.required],
          overtimeEnabled:[EmpData.overtimeEnabled,Validators.required],    
          ctc: [0],
          nightRate:[EmpData.nightRate],
          otRate:[EmpData.otRate],
          foodingEnabled:[EmpData.foodingEnabled,Validators.required],
          fixedCtc:[EmpData.fixedCtc],
          remarks:[EmpData.remarks]
        }),
        statutory: this.fb.group({
          esiInsuranceNo: [EmpData.esiInsuranceNo],
          pfAccountNo:[EmpData.pfAccountNo],
          esiEmployerCode:[EmpData.esiEmployerCode],
          esiLocalOffice:[EmpData.esiLocalOffice],
          dispensary:[EmpData.dispensary],
          pfNominee:[EmpData.pfNominee],
          pfSharePercent:[EmpData.pfSharePercent],
          gratuityNominee:[EmpData.gratuityNominee,Validators.required],
          gratuitySharePercent:[EmpData.gratuitySharePercent,Validators.required],
          childrenPension:[EmpData.childrenPension],
          widowPension:[EmpData.widowPension],
          perticularOfFamily:[EmpData.perticularOfFamily],
          esiNomineeForPayment:[EmpData.esiNomineeForPayment],
          familyMemberResidingInsuredPerson:[EmpData.familyMemberResidingInsuredPerson],
        })
      
      }); 

      EmpData.employeeExperiences.forEach((element:any) => {
        this.experienceDetails.push(this.patchExperience(element));
      });
      debugger;
      EmpData.employeeFamilyMembers.forEach((element:any) => {
        const familyGroup = this.createFamilyMember(element);
        this.familyMembers.push(familyGroup); 
      });
      debugger;
      setTimeout(()=>{
        this.isApiSucces = true;
      },1000)
      
      },
      error: (err) => {
        alert(JSON.stringify(err.error))
      }
      
    });
  }

  loadMaster( ){
    this.employeeService.getMasterData().subscribe({
      next: (response) => {
       this.masterData =  response
      },
      error: (err) => {
        alert(JSON.stringify(err.error))
      }
      
    });
  }
  GetCompanies( ){
    this.employeeService.GetCompanies().subscribe({
      next: (response) => {
       this.companyList =  response
      },
      error: (err) => {
        alert(JSON.stringify(err.error))
      }
      
    });
  }
  
  

  prevStep() {
    if (this.step > 1) this.step--;
  }

  getStepGroup(): FormGroup {
    switch (this.step) {
      case 1: return this.employeeForm.get('personalInfo') as FormGroup;
      case 2: return this.employeeForm.get('contactFamily') as FormGroup;
      case 3: return this.employeeForm.get('qualificationExpe') as FormGroup;
      case 4: return this.employeeForm.get('additionalInfo') as FormGroup;
      case 5: return this.employeeForm.get('salaryPayroll') as FormGroup;
      case 6: return this.employeeForm.get('statutory') as FormGroup;
      default: return this.employeeForm;
    }
  }

  getValidationErrors(group: FormGroup): string[] {
    const errors: string[] = [];
    Object.keys(group.controls).forEach(key => {
      const control = group.get(key);
      if (control && control.invalid) {
        errors.push(`${key} is required.`);
      }
    });
    return errors;
  }

  isFieldInvalid(groupName: string, fieldName: string): boolean {
    const control = this.employeeForm.get(`${groupName}.${fieldName}`);
    return control?.invalid && control?.touched ? true : false;
  }
  get personalInfoForm(): FormGroup {
    return this.employeeForm.get('personalInfo') as FormGroup;
  }
  get contactFamilyForm():FormGroup{
    return this.employeeForm.get('contactFamily') as FormGroup;
  }
  // Getter to access FormArray
  get familyMembers(): FormArray {
    return this.employeeForm.get('contactFamily.employeeFamilyMembers') as FormArray;
  }
  get qualificationExpeForm():FormGroup{
    return this.employeeForm.get('qualificationExpe') as FormGroup;
  }
  get experienceDetails(): FormArray {
    return this.qualificationExpeForm.get('employeeExperiences') as FormArray;
  }
  get additionalInfoForm(): FormGroup {
    return this.employeeForm.get('additionalInfo') as FormGroup;
  }
  get salaryPayrollForm(): FormGroup {
    return this.employeeForm.get('salaryPayroll') as FormGroup;
  }
  get statutoryForm():FormGroup{
    return this.employeeForm.get('statutory') as FormGroup;
  }
    
 ngOnInit(): void {
  //this.disablePersonalInfoValidators();
 // this.addExperience();  // Initialize with one experience row
  this.loadMaster();
  this.GetCompanies();
  const storedData = localStorage.getItem('formData');
   if (storedData) {
    console.log('Retrieved from localStorage:', JSON.parse(storedData));
   } else {
    console.log('No data found in localStorage');
   }
  }
 
 // Method to create a new FormGroup for family member
  createFamilyMember(familyMember: any = null): FormGroup {
    debugger;
   return this.fb.group({
     familyMemberId: [familyMember?.familyMemberId || 0],
     employeeId: [familyMember?.employeeId || 0],
     name: [familyMember?.name || '11', Validators.required],
     yearOfBirth: [familyMember?.yearOfBirth || '11', Validators.required],
     relation: [familyMember?.relation || '11', Validators.required]
   });
  }

  addFamilyMember() {
    console.log('Add Family Member clicked!'); 
    const familyGroup = this.createFamilyMember();
    this.familyMembers.push(familyGroup);
    
    console.log('Family Members:', this.familyMembers.value);  // Check the added members
  }
  removeFamilyMember(index: number) {
    this.familyMembers.removeAt(index);
  }

  createExperience(): FormGroup {
    return this.fb.group({
      employerName: [''],
      postHeld: [''],
      fromDate: [''],
      toDate: [''],
      reasonForLeaving: ['']
    });
  }

  patchExperience(data:any): FormGroup {
    return this.fb.group({
      experienceId: [data.experienceId],
      employeeId: [data.employeeId],
      employerName: [data.employerName],
      postHeld: [data.postHeld],
      fromDate: [ formatDate(data.fromDate,'yyyy-MM-dd','en')],
      toDate: [formatDate(data.toDate,'yyyy-MM-dd','en')],
      reasonForLeaving: [data.reasonForLeaving]
    });
  }

  addExperience(): void {
    this.experienceDetails.push(this.createExperience());
  }
   // Remove experience row
   removeExperience(index: number): void {
    if (this.experienceDetails.length > 1) {
      this.experienceDetails.removeAt(index);
    }
  }


 disablePersonalInfoValidators() {
   const personalInfoGroup = this.employeeForm.get('personalInfo') as FormGroup;
   const contactFamilyGroup = this.employeeForm.get('contactFamily') as FormGroup;
   const qualificationExpeGroup = this.employeeForm.get('qualificationExpe') as FormGroup;
   const additionalInfoGroup = this.employeeForm.get('additionalInfo') as FormGroup; 
   const salaryPayrollGroup = this.employeeForm.get('salaryPayroll') as FormGroup;  //  Disable Step 5
 
   if (personalInfoGroup) {
      personalInfoGroup.disable();   //  Completely disable Step 2
      console.log('Step 2 disabled');
   }
 
   if (contactFamilyGroup) {
      contactFamilyGroup.disable();  //  Completely disable Step 3
      console.log('Step 3 disabled');
   }
 
   if (qualificationExpeGroup) {
      qualificationExpeGroup.disable();  //  Optionally disable Step 3 as well
      console.log('Step 3 qualification section disabled');
   }
   if (additionalInfoGroup) {    //  Disabling Step 4
      additionalInfoGroup.disable();
      console.log('Step 4 disabled');
    }
    if (salaryPayrollGroup) {    
      salaryPayrollGroup.disable();  //  Disable Step 5
      console.log('Step 5 disabled');
    }

  }
  onSave() {
    // if (this.employeeForm.invalid) {
    //   return;
    // }
    const formData = this.employeeForm.value;
    const payload = {
       
      ...formData.personalInfo,
      ...formData.contactFamily,
      ...formData.qualificationExpe,
      ...formData.additionalInfo,
      ...formData.salaryPayroll,
      ...formData.statutory,
  
      employeeFamilyMembers: formData.contactFamily.employeeFamilyMembers.map((member: any) => ({
        familyMemberId: member.familyMemberId, // Default for new records
        employeeId: member.employeeId, // Fetch if needed
        name: member.name,
        yearOfBirth: member.yearOfBirth,
        relation: member.relation,
      })),
  
      employeeExperiences: formData.qualificationExpe.employeeExperiences.map((exp: any) => ({
        experienceId: exp.experienceId, // Default
        employeeId: exp.employeeId, // Fetch if needed
        employerName: exp.employerName,
        postHeld: exp.postHeld,
        fromDate: exp.fromDate,
        toDate: exp.toDate,
        reasonForLeaving: exp.reasonForLeaving,
      }))
    };
  
    console.log('Prepared Payload:', payload);
    payload.employeeId = this.editId;
    this.employeeService.updateEmployee(payload).subscribe({
      next: (response) => {
        console.log('Success:', response);
        alert("Employee Update Success")
      },
      error: (err) => {
        alert(JSON.stringify(err.error))
      }
      
    });
  }
  onReset() {
    this.employeeForm.reset();
    this.disablePersonalInfoValidators();
    localStorage.removeItem('formData'); // Clear localStorage if needed
  }
  print() {
    const printContents = document.getElementById('print-section')?.innerHTML;
    const originalContents = document.body.innerHTML;

    if (printContents) {
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // optional: reload to restore state
    }
  }
}

