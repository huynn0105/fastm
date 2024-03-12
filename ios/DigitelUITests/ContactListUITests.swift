//
//  ContactListUITests.swift
//  DigitelUITests
//
//  Created by anhtu on 6/20/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import XCTest

class ContactListUITests: XCTestCase {
    
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
    
    func test_contactlist() {
        let tabbar = app.otherElements["test_tabbar_contactlist"]
        XCTAssertTrue(tabbar.waitForExistence(timeout: 15))
        tabbar.tap()
        
        let contactlist = app.otherElements["test_contactlist"]
        XCTAssertTrue(contactlist.waitForExistence(timeout: 8))
        snapshot("test_contactlist")
        
        sleep(2)
    }
}
