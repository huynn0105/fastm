//
//  BaseTestCase.swift
//  DigitelUITests
//
//  Created by anhtu on 6/13/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import XCTest

class BaseTestCase: XCTestCase {
    
    let app = XCUIApplication();
    
    override class func setUp() {
        super.setUp()
        check_to_logout()
        login()
    }

    override class func tearDown() {
        logout()
        super.tearDown()
    }
        
    override func setUp() {
        super.setUp()
        
        continueAfterFailure = false
        setupSnapshot(app)
        app.launch()
    }
    
    override func tearDown() {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
        super.tearDown()
    }
    
    class func back() {
        var back = XCUIApplication().buttons["header-back"]
        if back.exists {
            back.tap()
        }
        else {
            XCUIApplication().otherElements["header-back"].firstMatch.tap()
        }
    }
    
    class func login(username: String = AppAcc.normal.username,
               pass: String = AppAcc.normal.pass) {
        let tfName = XCUIApplication().textFields["input_id"]
        tfName.waitForExistence(timeout: 20)
        tfName.tap()
        tfName.typeText(username)
        
        let tfPass = XCUIApplication().secureTextFields["input_pass"]
        tfPass.waitForExistence(timeout: 10)
        tfPass.tap()
        tfPass.typeText(pass)
        
        let btnLogin = XCUIApplication().otherElements["btn_login"]
        btnLogin.tap()
        
        let btnAvatar = XCUIApplication().otherElements["test_UserAvatar"]
        btnAvatar.waitForExistence(timeout: 15)
    }
    
    class func logout() {
        let btnAvatar = XCUIApplication().otherElements["test_UserAvatar"]
        btnAvatar.waitForExistence(timeout: 15)
        btnAvatar.tap()
        
        let profile = XCUIApplication().otherElements["test_ScrollView_Profile"].firstMatch
        profile.waitForExistence(timeout: 10)
        profile.swipeUp()
        
        let btnLogout = XCUIApplication().otherElements["test_btn_logout"]
        btnLogout.tap()
        
        let allowBtn = XCUIApplication().buttons["Đăng xuất"]
        if allowBtn.exists {
            allowBtn.tap()
        }
        
        let tfNameAgain = XCUIApplication().textFields["input_id"]
        tfNameAgain.waitForExistence(timeout: 20)
        XCTAssertEqual(tfNameAgain.exists, true)
    }
    
    class func check_to_logout() {
        let tfName = XCUIApplication().textFields["input_id"]
        if tfName.waitForExistence(timeout: 20) {
            return
        }
        logout()
    }
    
}
