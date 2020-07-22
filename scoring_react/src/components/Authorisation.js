import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import jQuery from 'jquery'


export  default class Authorisation extends Component {
    state = {
        errorMessage: ''
    };

    onInputChange = (event) =>{
        const name = event.target.name;
        this.setState({
            [name]: event.target.value
        });
        console.log(name, ' : ', event.target.value);
    };

    logIn = (e) => {
        e.preventDefault();
        const password = this.state.password;
        const self = this;
        const changeUserType = this.props.changeUserType;
        jQuery.ajax("https://crm.procredit.by/apps/scoring/logIn.php", {
            method: "POST",
            crossDomain: true,
            data: {password:password},
            async: false,
            success: function (msg) {
                let data = JSON.parse(msg);
                console.dir(data);
                if(data=== 'user'){
                    changeUserType(1);
                }
                else if(data=== 'admin'){
                    changeUserType(2);
                }
                else if(data === false){
                    self.setState({
                        errorMessage  : 'Неверный пароль!'
                    })
                }

            },
            error(jqXHR,  textStatus,  errorThrown ){
                console.dir(jqXHR);
                console.dir(textStatus);
                console.dir(errorThrown);
            }
        });

    };

    render() {

        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-4 offset-4">
                        <form id="authorisation">
                            <div className="form-group">
                                <label htmlFor="exampleInputPassword1">Ведите пароль</label>
                                <input type="password"
                                       name="password"
                                       onChange={this.onInputChange}
                                       className="form-control"
                                       id="exampleInputPassword1"
                                       placeholder="Password"/>
                            </div>
                            <p className="error-message">{this.state.errorMessage}</p>
                            <button type="submit" onClick={this.logIn} className="btn btn-success">Отправить</button>

                        </form>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}