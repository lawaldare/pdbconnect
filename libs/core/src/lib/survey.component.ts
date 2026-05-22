import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { SurveyService } from './services/survey.service';
import { SurveyQuestion } from './models/survey-config';

const TEXT_MAX_LENGTH = 400;

@Component({
  selector: 'lib-survey-popup',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (showSurvey()) {
      <div class="survey-popup">
        <div class="survey-container">
          <!-- HEADER -->
          <div class="survey-header">
            <p class="h4">{{ config()?.title }}</p>
            <button class="close-btn" (click)="close()">✕</button>
          </div>

          @if (!submitted) {
            <!-- QUESTION WIZARD -->
            <div class="survey-question-area">
              @if (currentQuestion()) {
                <p class="survey-progress">{{ questionProgress }}</p>
                <p class="survey-question-title" [innerHTML]="currentQuestion()?.title"></p>
                @if (currentQuestion()?.subtitle) {
                  <p class="survey-question-subtitle" [innerHTML]="currentQuestion()?.subtitle"></p>
                }

                <!-- STAR RATING -->
                @if (currentQuestion()?.type === 'rating') {
                  <div class="stars">
                    @for (i of [1, 2, 3, 4, 5]; track i) {
                      <span class="star" [class.filled]="answers()[currentId] >= i" (click)="saveAnswer(currentId!, i)">★</span>
                    }
                  </div>
                }

                <!-- MULTIPLE CHOICE -->
                @if (currentQuestion()?.type === 'multiple') {
                  <div class="multiple-row">
                    @for (choice of currentQuestion()?.choices ?? []; track choice) {
                      <label class="choice-row">
                        <input
                          type="radio"
                          [name]="currentId"
                          [value]="choice"
                          [checked]="answers()[currentId] === choice"
                          (change)="saveAnswer(currentId!, choice)"
                        />
                        {{ choice }}
                      </label>
                    }
                  </div>
                }

                <!-- MULTIPLE CHOICE (CHECK BOXES) -->
                @if (currentQuestion()?.type === 'multiple-check') {
                  <div class="multiple-row">
                    @for (choice of currentQuestion()?.choices ?? []; track choice) {
                      <label class="choice-row">
                        <input
                          type="checkbox"
                          [name]="currentId"
                          [value]="choice"
                          [checked]="answers()[currentId]?.includes(choice)"
                          (change)="onCheckboxChange(currentId!, choice, $event)"
                        />
                        {{ choice }}
                      </label>
                    }
                  </div>
                }

                <!-- TEXT -->
                @if (currentQuestion()?.type === 'text') {
                  <textarea class="survey-text-input" [attr.maxLength]="textMax" (input)="onTextInput(currentId!, $any($event.target).value)"></textarea>

                  <div class="char-remaining">{{ textMax - (answers()[currentId]?.length ?? 0) }} characters left</div>
                }
              }
            </div>

            <!-- FOOTER ACTIONS -->
            <div class="survey-footer">
              <!-- Wizard navigation -->
              <button class="nav-btn" [disabled]="currentIndex === 0" (click)="prev()">Back</button>

              <!-- NEXT (not last question) -->
              @if (!isLastQuestion) {
                <button class="submit-btn" [disabled]="isCurrentRequiredUnanswered" (click)="next()">Next</button>
              }

              <!-- SUBMIT (last question only) -->
              @if (isLastQuestion) {
                <button class="submit-btn" [disabled]="!allRequiredAnswered || submitted" (click)="submit()">Submit</button>
              }
            </div>
            <!-- Optional extra link -->
            @if (config()?.feedbackUrl) {
              <div class="feedback-link">
                <a [href]="config()?.feedbackUrl" target="_blank"> Click here</a>
                <span> to report bugs or to give more detailed feedback.</span>
              </div>
            }
          }
          <!-- IF SUBMITTED: SHOW THANK YOU -->
          @if (submitted) {
            <div class="thank-you">
              <p>Thank you for your feedback!</p>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [
    `
      .survey-popup {
        position: fixed;
        bottom: 15px;
        right: 15px;
        max-width: 340px;
        background: white;
        color: #222;
        padding: 1rem;
        border: 1px solid #ccc;
        box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 99999;
        font-size: 14px;
      }

      .survey-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0;

        .h4 {
          font-size: 21px;
          font-style: normal;
          font-weight: 500;
          line-height: 27.3px;
          margin-bottom: 0;
        }
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #666;
        top: 12px;
        position: absolute;
        right: 6px;
      }

      .survey-question-area {
        min-height: 60px;
        max-height: 45vh;
        overflow-y: scroll;
        padding: 5px 0 10px;
        display: flex;
        flex-direction: column;
        align-items: center;

        .multiple-row {
          width: 85%;
          label {
            white-space: nowrap;
          }
        }
      }

      .survey-progress {
        font-size: 14px;
        opacity: 0.6;
        margin: 0 0 4px !important;
        align-self: flex-start;
      }

      .survey-question-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 6px !important;
      }

      .survey-question-subtitle {
        font-size: 14px;
        font-weight: 400;
        margin-bottom: 6px !important;
        a {
          font-size: 14px;
          line-height: normal;
        }
      }

      /* STAR RATING */
      .stars {
        display: flex;
        gap: 6px;
      }

      .star {
        font-size: 24px;
        cursor: pointer;
        color: #bbb;
        transition: color 0.2s;
      }

      .star.filled {
        color: #ffc107;
      }

      .survey-text-input {
        width: 100%;
        min-height: 80px;
        resize: vertical;
        border-radius: 6px;
        border: 1px solid #aaa;
        padding: 6px;
        margin: 0;
      }

      .char-remaining {
        width: 100%;
        font-size: 12px;
        margin-top: 2px;
        opacity: 0.7;
      }

      /* Wizard footer */
      .survey-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.5rem;
      }

      .nav-btn {
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
        color: #3b6fb6;
      }

      .nav-btn:disabled {
        opacity: 0.4;
        cursor: default;
      }

      .submit-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 36px;
        padding: 8px 16px;
        box-shadow: 4px 4px 0 0 #0a5032;
        margin: 0;
        appearance: none;
        backface-visibility: hidden;
        background-color: #fff;
        border: 2px solid #0a5032;
        color: #0a5032;
        cursor: pointer;
        font-family: 'IBM Plex Sans', Helvetica, Arial, sans-serif;
        font-size: 16px;
        font-weight: 700;
        line-height: 22.7px;
      }

      .submit-btn:hover {
        box-shadow: 1px 1px 0 0 #0a5032;
        transform: translate(6px, 6px);
      }

      .feedback-link {
        margin-top: 0.75rem;
        font-size: 14px;
        text-align: center;
        a {
          font-size: 14px;
        }
      }

      .thank-you {
        padding: 20px 10px;
        text-align: center;
        font-size: 16px;
        font-weight: 600;
      }
    `,
  ],
})
export class SurveyPopupComponent {
  currentIndex = 0;

  get questions() {
    return this.config()?.questions ?? [];
  }

  get currentId(): string {
    return this.currentQuestion()?.id ?? '';
  }

  get questionProgress(): string {
    const total = this.questions.length;
    const questionHasChoices = this.currentQuestion()?.choices?.length;
    const questionOpts = questionHasChoices ? `(${questionHasChoices} options)` : '';
    return `Question ${this.currentIndex + 1} of ${total} ${questionOpts}`;
  }

  get isLastQuestion(): boolean {
    return this.currentIndex === this.questions.length - 1;
  }

  get currentAnswer(): any {
    return this.answers()[this.currentId];
  }

  get isCurrentRequiredUnanswered(): boolean {
    const q = this.currentQuestion();
    if (!q) return false;
    return q.skip === false && (this.currentAnswer === undefined || this.currentAnswer === '');
  }

  get allRequiredAnswered(): boolean {
    return this.questions.every((q) => {
      if (q.skip) return true; // optional
      const val = this.answers()[q.id];
      return val !== undefined && val !== null && val !== '';
    });
  }

  private survey = inject(SurveyService);
  showSurvey = () => this.survey.showSurvey();
  config = () => this.survey.config();
  answers = () => this.survey.answers();

  submitted = false;

  textMax = TEXT_MAX_LENGTH;

  currentQuestion(): SurveyQuestion | undefined {
    return this.questions[this.currentIndex];
  }

  next() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  saveAnswer(questionId: string, value: any) {
    this.survey.saveAnswer(questionId, value);
  }

  onCheckboxChange(questionId: string, choice: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    const current: string[] = this.answers()[questionId] ?? [];

    let updated: string[];

    if (checked) {
      updated = [...current, choice];
    } else {
      updated = current.filter((c) => c !== choice);
    }

    this.saveAnswer(questionId, updated);
  }

  /** Hard-coded limit + HTML sanitisation */
  onTextInput(questionId: string, raw: string) {
    const cleaned = this.sanitize(raw).slice(0, this.textMax);
    this.saveAnswer(questionId, cleaned);
  }

  /** Simple HTML stripping */
  sanitize(text: string): string {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerText;
  }

  submit() {
    this.submitted = true;

    const formattedAnswers = Object.fromEntries(
      Object.entries(this.answers()).map(([key, value]) => {
        if (Array.isArray(value)) {
          return [key, value.join('\r\n')]; // newline-separated for checkbox
        }
        return [key, value];
      })
    );

    this.survey.submit(formattedAnswers);

    setTimeout(() => {
      this.survey.showSurvey.set(false);
    }, 2000);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.close();
  }

  close() {
    this.survey.showSurvey.set(false);
    this.survey.handleCloseClick();
  }
}
