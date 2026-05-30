"""
AME Portal Backend API Tests
Tests for admin, branch, and student endpoints
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
ADMIN_EMAIL = "admin@ame.com"
ADMIN_PASSWORD = "admin123"
BRANCH_HEAD_EMAIL = "branchhead1773412122@ame.com"
BRANCH_HEAD_PASSWORD = "Branch123!"
STAFF_EMAIL = "staff1773412122@ame.com"
STAFF_PASSWORD = "Staff123!"
STUDENT_EMAIL = "9890011223@ameportal.in"
STUDENT_PASSWORD = "9890011223"


class TestAuth:
    """Authentication tests"""
    
    def test_admin_login_success(self):
        """Test admin login with correct credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["role"] == "ADMIN"
        print(f"✓ Admin login successful: {data['user']['email']}")
    
    def test_branch_head_login_success(self):
        """Test branch head login with correct credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": BRANCH_HEAD_EMAIL,
            "password": BRANCH_HEAD_PASSWORD
        })
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "token" in data
        assert data["user"]["role"] == "BRANCH_HEAD"
        print(f"✓ Branch Head login successful: {data['user']['email']}")
    
    def test_staff_login_success(self):
        """Test staff login with correct credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": STAFF_EMAIL,
            "password": STAFF_PASSWORD
        })
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "token" in data
        assert data["user"]["role"] == "STAFF"
        print(f"✓ Staff login successful: {data['user']['email']}")
    
    def test_student_login_success(self):
        """Test student login with correct credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": STUDENT_EMAIL,
            "password": STUDENT_PASSWORD
        })
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "token" in data
        assert data["user"]["role"] == "STUDENT"
        print(f"✓ Student login successful: {data['user']['email']}")
    
    def test_invalid_credentials_rejected(self):
        """Test that invalid credentials are rejected"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "invalid@example.com",
            "password": "wrongpassword"
        })
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ Invalid credentials correctly rejected")


class TestAdminEndpoints:
    """Admin API tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get admin token for authenticated requests"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            self.admin_token = response.json()["token"]
            self.headers = {"Authorization": f"Bearer {self.admin_token}"}
        else:
            pytest.skip("Admin login failed")
    
    def test_admin_dashboard(self):
        """Test admin dashboard endpoint"""
        response = requests.get(f"{BASE_URL}/api/admin/dashboard", headers=self.headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "active_branches" in data
        assert "total_students" in data
        assert "verified_enrollments" in data
        assert "gross_revenue" in data
        print(f"✓ Admin dashboard: {data['active_branches']} branches, {data['total_students']} students")
    
    def test_admin_analytics(self):
        """Test admin analytics endpoint with filters"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics", headers=self.headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "counselling_type_distribution" in data
        assert "verification_status_distribution" in data
        assert "category_distribution" in data
        assert "location_distribution" in data
        assert "revenue_by_branch" in data
        assert "registration_trends" in data
        print(f"✓ Admin analytics loaded with {len(data.get('registration_trends', []))} trend data points")
    
    def test_admin_analytics_with_filters(self):
        """Test admin analytics endpoint with date filters"""
        response = requests.get(
            f"{BASE_URL}/api/admin/analytics?date_from=2025-01-01&date_to=2030-12-31",
            headers=self.headers
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        print("✓ Admin analytics with filters working")
    
    def test_admin_branches_list(self):
        """Test admin branches list endpoint"""
        response = requests.get(f"{BASE_URL}/api/admin/branches", headers=self.headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Admin branches list: {len(data)} branches found")
    
    def test_admin_students_drilldown(self):
        """Test admin students drilldown endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/admin/students-drilldown?page=1&limit=20",
            headers=self.headers
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "students" in data
        assert "total" in data
        print(f"✓ Admin drilldown: {data['total']} total students")
    
    def test_admin_export_students(self):
        """Test admin export students endpoint"""
        response = requests.get(f"{BASE_URL}/api/admin/export-students", headers=self.headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        assert "spreadsheet" in response.headers.get("Content-Type", "") or "octet-stream" in response.headers.get("Content-Type", "")
        print("✓ Admin export students working (Excel download)")
    
    def test_admin_audit_logs(self):
        """Test admin audit logs endpoint"""
        response = requests.get(f"{BASE_URL}/api/admin/audit-logs", headers=self.headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "logs" in data
        assert "total" in data
        print(f"✓ Admin audit logs: {data['total']} entries")


class TestBranchEndpoints:
    """Branch API tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get branch head token for authenticated requests"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": BRANCH_HEAD_EMAIL,
            "password": BRANCH_HEAD_PASSWORD
        })
        if response.status_code == 200:
            self.branch_token = response.json()["token"]
            self.headers = {"Authorization": f"Bearer {self.branch_token}"}
        else:
            pytest.skip("Branch head login failed")
    
    def test_branch_dashboard(self):
        """Test branch dashboard endpoint"""
        response = requests.get(f"{BASE_URL}/api/branch/dashboard", headers=self.headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "total_students" in data
        assert "verified_students" in data
        assert "pending_verification" in data
        assert "total_revenue" in data
        print(f"✓ Branch dashboard: {data['total_students']} students, Rs.{data['total_revenue']} revenue")
    
    def test_branch_students_list(self):
        """Test branch students list endpoint"""
        response = requests.get(f"{BASE_URL}/api/branch/students", headers=self.headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "students" in data
        assert "total" in data
        print(f"✓ Branch students list: {data['total']} students")
        return data.get("students", [])
    
    def test_branch_analytics(self):
        """Test branch analytics endpoint"""
        response = requests.get(f"{BASE_URL}/api/branch/analytics", headers=self.headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "total_students" in data
        assert "verified_students" in data
        assert "counselling_type_distribution" in data
        print(f"✓ Branch analytics: {data['total_students']} total students")
    
    def test_branch_export_students(self):
        """Test branch export students endpoint"""
        response = requests.get(f"{BASE_URL}/api/branch/export-students", headers=self.headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        print("✓ Branch export students working")
    
    def test_branch_staff_list(self):
        """Test branch staff list endpoint"""
        response = requests.get(f"{BASE_URL}/api/branch/staff", headers=self.headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Branch staff list: {len(data)} staff members")
    
    def test_branch_verification_queue(self):
        """Test branch verification queue endpoint"""
        response = requests.get(f"{BASE_URL}/api/branch/verification-queue", headers=self.headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Branch verification queue: {len(data)} students pending")
    
    def test_branch_staff_list_all(self):
        """Test branch staff list endpoint for all staff"""
        response = requests.get(f"{BASE_URL}/api/branch/staff-list", headers=self.headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Branch staff list (all): {len(data)} staff/heads")


class TestBranchStudentActions:
    """Branch student actions tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get branch head token and find a student"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": BRANCH_HEAD_EMAIL,
            "password": BRANCH_HEAD_PASSWORD
        })
        if response.status_code == 200:
            self.branch_token = response.json()["token"]
            self.headers = {"Authorization": f"Bearer {self.branch_token}"}
        else:
            pytest.skip("Branch head login failed")
        
        # Get a student ID
        response = requests.get(f"{BASE_URL}/api/branch/students?limit=1", headers=self.headers)
        if response.status_code == 200:
            students = response.json().get("students", [])
            if students:
                self.student_id = students[0]["id"]
            else:
                pytest.skip("No students found in branch")
        else:
            pytest.skip("Could not retrieve students")
    
    def test_get_student_details(self):
        """Test getting individual student details"""
        response = requests.get(f"{BASE_URL}/api/branch/students/{self.student_id}", headers=self.headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "student" in data
        assert "documents" in data
        print(f"✓ Student details retrieved: {data['student']['full_name']}")
    
    def test_get_student_receipt_data(self):
        """Test getting student receipt data"""
        response = requests.get(f"{BASE_URL}/api/branch/students/{self.student_id}/receipt", headers=self.headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "student" in data
        assert "branch" in data
        print(f"✓ Receipt data retrieved for: {data['student']['registration_no']}")
    
    def test_update_student_additional_details(self):
        """Test updating student additional details"""
        response = requests.put(
            f"{BASE_URL}/api/branch/students/{self.student_id}/additional",
            headers=self.headers,
            json={
                "mother_name": "Test Mother",
                "email": "test@example.com",
                "religion": "Test Religion",
                "family_income": "500000",
                "aadhaar_number": "123456789012",
                "address": "Test Address",
                "taluka": "Test Taluka",
                "address_district": "Test District",
                "pin_code": "411001",
                "edu_10_year": "2020",
                "edu_10_board": "Maharashtra State Board",
                "edu_10_percentage": "85",
                "edu_12_year": "2022",
                "edu_12_board": "Maharashtra State Board",
                "edu_12_percentage": "80",
                "father_occupation": "Business",
                "mother_occupation": "Homemaker"
            }
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data.get("has_additional_details") == True
        print(f"✓ Additional details updated for student")
    
    def test_get_verification_data(self):
        """Test getting verification data for a student"""
        response = requests.get(f"{BASE_URL}/api/branch/verification/{self.student_id}", headers=self.headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "student" in data
        assert "documents" in data
        assert "previous_logs" in data
        print(f"✓ Verification data retrieved with {len(data.get('previous_logs', []))} previous logs")


class TestStudentEndpoints:
    """Student API tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get student token for authenticated requests"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": STUDENT_EMAIL,
            "password": STUDENT_PASSWORD
        })
        if response.status_code == 200:
            self.student_token = response.json()["token"]
            self.headers = {"Authorization": f"Bearer {self.student_token}"}
        else:
            pytest.skip("Student login failed")
    
    def test_student_dashboard(self):
        """Test student dashboard endpoint"""
        response = requests.get(f"{BASE_URL}/api/student/dashboard", headers=self.headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "profile" in data
        assert "documents" in data
        assert "branch" in data
        profile = data["profile"]
        assert "full_name" in profile
        assert "registration_no" in profile
        assert "counselling_type" in profile
        print(f"✓ Student dashboard: {profile['full_name']} ({profile['registration_no']})")
    
    def test_student_profile(self):
        """Test student profile endpoint"""
        response = requests.get(f"{BASE_URL}/api/student/profile", headers=self.headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "full_name" in data
        assert "phone" in data
        assert "verification_status" in data
        assert "additional_details" in data
        assert "education_10th" in data
        assert "education_12th" in data
        print(f"✓ Student profile: {data['full_name']}, Status: {data['verification_status']}")
    
    def test_student_documents(self):
        """Test student documents endpoint"""
        response = requests.get(f"{BASE_URL}/api/student/documents", headers=self.headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Student documents: {len(data)} documents")
    
    def test_student_payments(self):
        """Test student payments endpoint"""
        response = requests.get(f"{BASE_URL}/api/student/payments", headers=self.headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Student payments: {len(data)} payments")
    
    def test_student_notifications(self):
        """Test student notifications endpoint"""
        response = requests.get(f"{BASE_URL}/api/student/notifications", headers=self.headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "notifications" in data
        assert "unread_count" in data
        print(f"✓ Student notifications: {data['unread_count']} unread")


class TestConstants:
    """Constants API test"""
    
    def test_constants_endpoint(self):
        """Test constants endpoint returns all required data"""
        response = requests.get(f"{BASE_URL}/api/constants")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "maharashtra_districts" in data
        assert "categories" in data
        assert "special_reservations" in data
        assert "medical_counselling_types" in data
        print(f"✓ Constants: {len(data['maharashtra_districts'])} districts, {len(data['categories'])} categories")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
