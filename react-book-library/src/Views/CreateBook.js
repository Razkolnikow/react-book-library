import React, { Component } from 'react';

export default class CreateBook extends Component {
  render() {
          return (
              <form className="create-book-form" onSubmit={this.submitForm.bind(this)}>
                  <h1>Create book</h1>
                  <label>
                      <div>Title:</div>
                      <input type="text" name="username" required
                             ref={e => this.titleField = e} />
                  </label>
                  <label>
                      <div>Author:</div>
                      <input type="text" required
                             ref={e => this.authorField = e} />
                  </label>
                  <label>
                      <div>Description:</div>
                      <textarea type="text" rows="10"
                             ref={e => this.descriptionField = e}>
                       </textarea>
                  </label>
                  <div>
                      <input type="submit" value="Create" />
                  </div>
              </form>
          );
      }

      submitForm(event) {
          event.preventDefault();
          this.props.onSubmit(
              this.titleField.value, this.authorField.value,
            this.descriptionField.value);
      }
}
