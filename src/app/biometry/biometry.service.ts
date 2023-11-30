import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BiometryService {

  constructor(private http: HttpClient) { }

  createBio(param:any):Observable<any>{
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(environment.apiUrl + 'optholbiometry',param,
      { headers: headers })
    }

  getBio(patientId: any): Observable<any> {
    let orgId = localStorage.getItem('org_id');
    let branchId = localStorage.getItem('branch_id');
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.get(environment.apiUrl + 'optholbiometrylist/'+ orgId + '/' + branchId + '?patient_id=' + patientId,
      { headers: headers })
    }
}