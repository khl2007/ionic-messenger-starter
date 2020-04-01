import { Component, OnInit } from '@angular/core';

import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Router } from '@angular/router';
import { MenuController, ToastController } from '@ionic/angular';

import { UserService } from '../../services/user.service';

import * as firebase from 'firebase/app';

@Component({
  selector: 'login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

validations_form: FormGroup;
  errorMessage: string = '';

  validation_messages = {
   'email': [
     { type: 'required', message: 'Email is required.' },
     { type: 'pattern', message: 'Please enter a valid email.' }
   ],
   'password': [
     { type: 'required', message: 'Password is required.' },
     { type: 'minlength', message: 'Password must be at least 5 characters long.' }
   ]
 };

  constructor(
    private menuCtrl: MenuController, 
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    private userService: UserService, 
    private router: Router
  ) {
  }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  tryLogin(value){
    this.authService.doLogin(value)
    .then(res => {
      this.router.navigate(["/home"]);
    }, err => {
      this.errorMessage = err.message;
      console.log(err)
    })
  }

  loginWithFacebook() {
    this.userService.signInWithProvider(new firebase.auth.FacebookAuthProvider())
      .then(_ => {
        this.navigateToHome();
    }, (error) => this.errorHandler(error));
  }

  loginWithGoogle() {
    this.userService.signInWithProvider(new firebase.auth.GoogleAuthProvider())
      .then(_ => {
        this.navigateToHome();
    }, (error) => this.errorHandler(error));
  }

  loginWithGithub() {
    this.userService.signInWithProvider(new firebase.auth.GithubAuthProvider())
      .then(_ => {
        this.navigateToHome();
    }, (error) => this.errorHandler(error));
  }

  private navigateToHome() {
    this.router.navigateByUrl('/');
    this.menuCtrl.enable(true);
  }

  private async errorHandler(e) {
    const toast = await this.toastCtrl.create({
      message: e.message || 'Unknown error'
    });
    toast.present();
  }

}
