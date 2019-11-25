import React, {Component, Fragment} from 'react';

import {Breadcrumb, BreadcrumbItem} from 'reactstrap';

import {faHome} from '@fortawesome/free-solid-svg-icons';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export default class TitleComponent3 extends Component {

    render() {
        let {
            childPageName,
            parentPageName,
        } = this.props;
        return (
            <Fragment>
                {
                    (parentPageName || childPageName) ?
                        <Breadcrumb>
                            <BreadcrumbItem><a>
                                <FontAwesomeIcon icon={faHome}/></a>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <a>{parentPageName}</a>
                            </BreadcrumbItem>
                            <BreadcrumbItem active>{childPageName}</BreadcrumbItem>
                        </Breadcrumb>
                        : <></>}
            </Fragment>
        );
    }
}
