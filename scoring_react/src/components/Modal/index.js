import React, {Component} from 'react'
import AriaModal from 'react-aria-modal';
import ProductForm from '../ModalForms/ProductForm';
import BankForm from '../ModalForms/BankForm'
import './style.css';
import {DataContext} from '../DataContext';

export default class Modal extends Component {

     state = {
         modalActive: this.props.isActive,
         typeOfModal: this.props.typeOfModal
     };

    activateModal = () => {
        this.setState({
            modalActive: true

        });
    };

    deactivateModal = () => {
        this.setState({ modalActive: false });
        this.props.closeModal();
    };

    getApplicationNode = () => {
        return document.getElementById('application');
    };

    render() {
        const modalBody =
            <DataContext.Consumer>

                {({banks, resetData, getData, userType})=>{
                    if(this.props.typeOfModal === 'productUpdate' || this.props.typeOfModal === 'productAdd') {
                        return <ProductForm
                            product={this.props.product}
                            banks={banks}
                            resetData={resetData}
                            getData = {getData}
                            consideration_type = {this.props.consideration_type}
                            deactivateModal={this.deactivateModal.bind(this)}
                            typeOfModal = {this.props.typeOfModal}
                            userType = {userType}
                        />;
                    }
                    else if(this.props.typeOfModal === 'bankUpdate'|| this.props.typeOfModal === 'bankAdd'){
                        return <BankForm
                            bank={this.props.bank}
                            banks={banks}
                            resetData={resetData}
                            deactivateModal={this.deactivateModal.bind(this)}
                            typeOfModal = {this.props.typeOfModal}
                            userType = {userType}
                        />;
                    }
                    else
                        return false;
                }}
            </DataContext.Consumer>;



        const modal = this.state.modalActive ?
            <AriaModal
                titleText="demo one"
                onExit={this.deactivateModal}
                getApplicationNode={this.getApplicationNode}
                underlayStyle={{ paddingTop: '2em' }}
                scrollDisabled={false}
            >
                <div className="modal">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title" >{this.props.title}</h4>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.deactivateModal}>
                                    <span aria-hidden="true" >&times;</span>
                                </button>

                            </div>
                            {modalBody}
                        </div>
                    </div>
                 </div>

            </AriaModal>
            : false;

        return (
            <div>
                {modal}
            </div>
        );
    }
}