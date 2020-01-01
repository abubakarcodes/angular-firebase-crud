import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
export interface Course {
  name: string;
  id: string;
}
export interface CourseId extends Course {
  id: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  coursesCollection: AngularFirestoreCollection<Course>;
  courses: Observable<CourseId[]>;
  constructor(private db: AngularFirestore) {

  }
ngOnInit() {
  this.coursesCollection = this.db.collection<Course>('/courses');
  this.courses = this.coursesCollection.snapshotChanges().pipe(
  map(actions => actions.map(a => {
    const data = a.payload.doc.data() as Course;
    const id = a.payload.doc.id;
    return { id, ...data };
  }))
);
}
addCourse(course: HTMLInputElement , price: HTMLInputElement) {
  this.db.collection('/courses').add({name: course.value, price: price.value});
  course.value = '';
  price.value = '';
}
updateCourse(course) {
this.db.collection('/courses').doc(course.id).update({
  name: course.name + ' updated',
  price: 200,
});


}


deleteCourse(course){
  this.db.collection('/courses').doc(course.id).delete();
}


}
