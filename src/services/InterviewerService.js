import http from './HttpUrl';
import httpauth from './AuthorizedHttpUrl';
import HttpUrl from './HttpUrl';

class InterviewerService {
    getCompany() {
        return httpauth.get('/api/interviewer/company/')
    }
    getInterviewerDetails(){
        return httpauth.get('/api/user/')
    }
}

export default new InterviewerService();