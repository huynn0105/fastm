//
//  SettingsUITests.swift
//  DigitelUITests
//
//  Created by anhtu on 6/21/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import XCTest

class SettingsUITests: XCTestCase {
    let app = XCUIApplication();
    
    override func setUp() {
        super.setUp()
        continueAfterFailure = false
        setupSnapshot(app)
        app.launch()
        BaseTestCase.check_to_logout()
        BaseTestCase.login()
    }
    
    override func tearDown() {
        super.tearDown()
    }
    
    func test_settings() {
        let tabbar = app.otherElements["test_tabbar_settings"]
        XCTAssertTrue(tabbar.waitForExistence(timeout: 15))
        tabbar.tap()
        
        let settings = app.otherElements["test_settings_screen"]
        XCTAssertTrue(settings.waitForExistence(timeout: 8))
        snapshot("test_settings_screen")
        sleep(2)
        
        // move to profile
        app.otherElements["test_UserInfoRow"].tap()
        XCTAssertTrue(app.otherElements["test_profile_screen"].waitForExistence(timeout: 5))
        snapshot("test_profile_screen")
        
        // scroll profile
        let profileScroll = app.otherElements["test_ScrollView_Profile"]
        profileScroll.swipeUp()
        snapshot("test_ScrollView_Profile")
        
        // move to edit bank
        let bank = app.otherElements["test_bank_row_0"]
        XCTAssertTrue(bank.waitForExistence(timeout: 8))
        bank.tap()
        sleep(8)
        snapshot("test_edit_bank")
        BaseTestCase.back()
        
        // move to add back
        app.otherElements["test_add_bank_row"].tap()
        sleep(8)
        snapshot("test_add_bank_row")
        BaseTestCase.back()

        // move back to profile
        BaseTestCase.back()
        
        // move to about
        app.otherElements["test_about_appay_row"].tap()
        snapshot("test_about_appay_row")
        BaseTestCase.back()
        
        // move to agreement
        app.otherElements["test_agreement_row"].tap()
        snapshot("test_agreement_row")
        BaseTestCase.back()
        
        // move to security
        app.otherElements["test_security_row"].tap()
        snapshot("test_security_row")
        BaseTestCase.back()
        
        // move to history
        app.otherElements["test_login_history_row"].tap()
        snapshot("test_login_history_row")
        BaseTestCase.back()
        
        // move to change pass
        app.otherElements["test_change_pass_row"].tap()
        snapshot("test_change_pass_row")
        BaseTestCase.back()
    }
}
