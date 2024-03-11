//
//  LoginUITests.swift
//  DigitelUITests
//
//  Created by anhtu on 6/20/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import XCTest

class LoginUITests: XCTestCase {
    
    let app = XCUIApplication();
    
    override func setUp() {
        super.setUp()
        continueAfterFailure = false
        setupSnapshot(app)
        app.launch()
    }
    
    func test_login_logout() {
        BaseTestCase.check_to_logout()
        snapshot("login")
        BaseTestCase.login()
        BaseTestCase.logout()
    }
    
}
