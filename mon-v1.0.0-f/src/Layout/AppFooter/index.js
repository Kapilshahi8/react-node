import React, {Fragment} from 'react';

class AppFooter extends React.Component {
    constructor(props){
        super(props);
        this.state= {
            year: new Date()
        };
    }
    render() {
        return (
            <Fragment>
                <div className="app-footer">
                    <div className="app-footer__inner">
                        <div className="app-footer-left">
                            
                        </div>
                        <div className="app-footer-right">
                            Copyright © {this.state.year.getFullYear()} Monarch Inc. All rights reserved.
                        </div>
                    </div>
                </div>
            </Fragment>
        )}
}

export default AppFooter;