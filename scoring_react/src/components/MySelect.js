import React from 'react';
import { withFormsy } from 'formsy-react';
import ReactSelect from 'react-select';



class MySelect extends React.Component {

    // propTypes: {
    //     id: React.PropTypes.string.isRequired,
    //     title: React.PropTypes.string.isRequired,
    //     name: React.PropTypes.string.isRequired,
    //     multiple: React.PropTypes.bool,
    //     options: React.PropTypes.array.isRequired
    // },

    changeValue= (value, selectedOptions)=>{
        if (this.props.multiple) {
            this.setValue(selectedOptions.map(option => option.value));
        } else {
            this.setValue(value);
        }
    };

    render() {
        var className = this.showRequired() ? 'required' : this.showError() ? 'error' : null;

        var errorMessage = this.getErrorMessage();

        return (
            <div className={'form-group' + (className ? ' ' + className : '') }>
                <label htmlFor={this.props.id}>{this.props.title}</label>
                <ReactSelect
                    ref="select"
                    id={this.props.id}
                    name={this.props.name}
                    multi={this.props.multiple}
                    onChange={this.changeValue}
                    value={this.getValue()}
                    options={this.props.options}
                />
                <span className='error-message'>{errorMessage}</span>
            </div>
        );
    }
}

export default withFormsy(MySelect);