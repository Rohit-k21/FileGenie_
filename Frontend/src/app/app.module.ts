import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatInputComponent } from './components/chat-input/chat-input.component';
import { ChatInterfaceComponent } from './components/chat-interface/chat-interface.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { CollectionSelectorComponent } from './components/collection-selector/collection-selector.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { HistorySidebarComponent } from './components/history-sidebar/history-sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { ButtonComponent } from './components/ui/button/button.component';
import { DialogComponent } from './components/ui/dialog/dialog.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { AutoCompleteModule } from 'primeng/autocomplete'; // Add this
import { NgIconsModule } from '@ng-icons/core';
import { heroUsers } from '@ng-icons/heroicons/outline';
import { DashboardCompComponent } from './pages/dashboard-comp/dashboard-comp.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, ChatInputComponent, ChatInterfaceComponent, ChatMessageComponent, CollectionSelectorComponent, FileUploadComponent, HistorySidebarComponent, NavbarComponent, ThemeToggleComponent, ButtonComponent, DialogComponent,  DashboardCompComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    SidebarModule,
    CalendarModule,
    DropdownModule,
    ScrollPanelModule,
    FormsModule,
    AutoCompleteModule,
    NgIconsModule.withIcons({ heroUsers }),
    HttpClientModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
