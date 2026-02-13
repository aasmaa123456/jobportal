import { v4 as uuidv4 } from 'uuid';

export default class JobModel {
    constructor(category, designation, location, companyName, salary, positions, skills, dueDate, recruiterId) {
        this.id = uuidv4();
        this.category = category;
        this.designation = designation;
        this.location = location;
        this.companyName = companyName;
        this.salary = salary;
        this.positions = positions;
        this.skills = skills; // Array
        this.dueDate = dueDate;
        this.recruiterId = recruiterId;
        this.applicants = [];
        this.postedDate = new Date().toLocaleDateString();
    }

    static jobs = [];

    static getAll() {
        return this.jobs;
    }

    static add(jobData, recruiterId) {
        const { category, designation, location, companyName, salary, positions, skills, dueDate } = jobData;
        const newJob = new JobModel(
            category, designation, location, companyName, salary, positions,
            Array.isArray(skills) ? skills : [skills], // Handle single or multiple skills
            dueDate, recruiterId
        );
        this.jobs.push(newJob);
        return newJob;
    }

    static getById(id) {
        return this.jobs.find(j => j.id === id);
    }

    static update(id, updatedData) {
        const index = this.jobs.findIndex(j => j.id === id);
        if (index > -1) {
            // Keep id, recruiterId, applicants, postedDate
            const job = this.jobs[index];
            this.jobs[index] = { ...job, ...updatedData, skills: Array.isArray(updatedData.skills) ? updatedData.skills : [updatedData.skills] };
            return this.jobs[index];
        }
        return null;
    }

    static delete(id) {
        const index = this.jobs.findIndex(j => j.id === id);
        if (index > -1) {
            this.jobs.splice(index, 1);
            return true;
        }
        return false;
    }

    static addApplicant(jobId, applicantData) {
        const job = this.getById(jobId);
        if (job) {
            const applicant = {
                id: uuidv4(),
                ...applicantData
            };
            job.applicants.push(applicant);
            return applicant;
        }
        return null;
    }

    static getApplicants(jobId) {
        const job = this.getById(jobId);
        return job ? job.applicants : [];
    }

    static search(query) {
        const lowerQuery = query.toLowerCase();
        return this.jobs.filter(job =>
            job.category.toLowerCase().includes(lowerQuery) ||
            job.designation.toLowerCase().includes(lowerQuery) ||
            job.companyName.toLowerCase().includes(lowerQuery)
        );
    }
}
