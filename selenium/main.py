import os

from selenium import webdriver
from selenium.common import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

from selenium.webdriver.support.wait import WebDriverWait


def change_element_color(driver, xpath, color):
    """Change the color of an element specified by its XPath."""
    element = driver.find_element(By.XPATH, xpath)
    driver.execute_script("arguments[0].style.backgroundColor = arguments[1];", element, color)


def test_open_login_page(url):
    """Test clicking Login button that opens the login page."""
    driver = webdriver.Chrome()
    try:
        driver.get(url)

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "/html/body/div/div/nav/div/ul/li[2]/a"))
        )

        click_target = driver.find_element(By.XPATH, "/html/body/div/div/nav/div/ul/li[2]/a")
        click_target.click()

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "/html/body/div/div/div[1]/div/div/form/h2"))
        )

        login_heading = driver.find_element(By.XPATH, "/html/body/div/div/div[1]/div/div/form/h2").text
        assert login_heading == "Login", "Login page did not open or the heading text is not 'Login'"

        print("Test passed: Login page opened with correct heading.")

    except Exception as e:
        print(f"Test failed: {e}")

    finally:
        # Clean up by closing the browser window
        driver.quit()


def test_login(url, username, password):
    # Initialize the WebDriver (example with Chrome)
    driver = webdriver.Chrome()

    try:
        driver.get(url)

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.NAME, "username"))
        )

        username_field = driver.find_element(By.NAME, "username")
        password_field = driver.find_element(By.NAME, "password")
        submit_button = driver.find_element(By.XPATH, "//button[@type='submit']")

        username_field.send_keys(username)
        password_field.send_keys(password)

        submit_button.click()

        time.sleep(5)

        if driver.current_url == "http://localhost:3000/dashboard":
            print("Login successful and on dashboard")
        else:
            print("Login failed or incorrect redirect")

    except Exception as e:
        print("An error occurred:", e)
    finally:
        driver.quit()


def test_register_page(url):
    """Test registration functionality and verify redirection to the dashboard, including image upload."""
    driver = webdriver.Chrome()
    try:
        driver.get(url)

        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, "username")))
        driver.find_element(By.NAME, "username").send_keys("testuser")
        driver.find_element(By.NAME, "email").send_keys("testuser@example.com")
        driver.find_element(By.NAME, "password").send_keys("testpassword123")
        driver.find_element(By.NAME, "confirm_password").send_keys("testpassword123")
        driver.find_element(By.NAME, "name").send_keys("Test User")
        driver.find_element(By.NAME, "accountType").send_keys("Saving")
        driver.find_element(By.NAME, "branch").send_keys("Main")

        image_path = os.path.join(os.getcwd(), 'image.jpg')
        driver.find_element(By.ID, "inputImage").send_keys(image_path)

        submit_button_xpath = "//html/body/div/div/div[1]/div/div/form/div[10]/button"
        submit_button = driver.find_element(By.XPATH, submit_button_xpath)
        driver.execute_script("arguments[0].scrollIntoView();", submit_button)
        driver.execute_script("arguments[0].click();", submit_button)

        wait = WebDriverWait(driver, 20)
        # time.sleep(100)
        success_xpath = "//div[contains(@class, 'dashboard')]"
        failure_xpath = "/html/body/div/div/div[1]/div/div/form/div[9]/div"

        success_condition = EC.presence_of_element_located((By.XPATH, success_xpath))
        failure_condition = EC.text_to_be_present_in_element((By.XPATH, failure_xpath), "Failed to create an account")

        try:
            wait.until(lambda driver: success_condition(driver) or driver.find_elements(By.XPATH,
                                                                                        failure_xpath)) or driver.find_element(By.NAME, "username")
            if driver.find_elements(By.XPATH, success_xpath):
                print("Registration successful, redirected to dashboard.")
            elif driver.find_elements(By.XPATH, failure_xpath):
                print("Registration failed: Failed to create an account.")
            else:
                print("Unexpected state.")
        except TimeoutException:
            print("Registration failed: Failed to create an account. Account already exist")
    except Exception as e:
        print(f"An error occurred during registration test: {e}")
    finally:
        driver.quit()


if __name__ == "__main__":
    loginURL = "http://localhost:3000/login"
    registerURL = "http://localhost:3000/register"

    username = "testuser"
    email = "testuser@example.com"
    password = "testpassword123"

    # test_open_login_page(loginURL)
    # test_register_page(registerURL)

    test_login(loginURL, username, password)
