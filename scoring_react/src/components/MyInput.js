import { withFormsy } from 'formsy-react';
import React from 'react';

class MyInput extends React.Component {
    constructor(props) {
        super(props);
        this.changeValue = this.changeValue.bind(this);
    }

    changeValue =(event)=> {
        // setValue() will set the value of the component, which in
        // turn will validate it and the rest of the form
        // Important: Don't skip this step. This pattern is required
        // for Formsy to work.
        this.props.setValue(event.currentTarget.value);
        this.props.onChange(event);
    };

    render() {
        // An error message is returned only if the component is invalid
        const errorMessage = this.props.getErrorMessage();
        console.log(this.props.isValid());


        return (
            <div>
                <input
                    id={this.props.id}
                    className={this.props.className}
                    name = {this.props.name}
                    onChange={this.changeValue}
                    type={this.props.type}
                    value={this.props.getValue() || this.props.value}
                    disabled={this.props.disabled}

                />
                {this.props.small}
                {this.props.isPristine() ? "" :
                    <span className='error-message'>{errorMessage}</span>
                }
            </div>
        );
    }
}

export default withFormsy(MyInput);