import JobModel from '../models/job.model.js';
import { sendConfirmationEmail } from '../services/email.service.js';

export default class JobController {
//fetch and show all jobs
    getAllJobs(req, res) {
        const jobs = JobModel.getAll();
        res.render('jobs/list', { title: 'Jobs', jobs, user: req.session.user });
    }

    getJobDetails(req, res) {
        const id = req.params.id;
        const job = JobModel.getById(id);
        if (!job) {
            return res.status(404).render('404', { title: 'Job Not Found' });
        }
        res.render('jobs/detail', { title: job.designation, job, user: req.session.user });
    }

    getCreateJob(req, res) {
        res.render('jobs/new', { title: 'Post App', errorMessage: null, oldInput: {} });
    }

    postCreateJob(req, res) {
        const jobData = req.body;
        JobModel.add(jobData, req.session.user.id);
        res.redirect('/jobs');
    }

    getUpdateJob(req, res) {
        const id = req.params.id;
        const job = JobModel.getById(id);
        if (!job) {
            return res.status(404).render('404', { title: 'Job Not Found' });
        }
        // Authorization check
        if (job.recruiterId !== req.session.user.id) {
            return res.status(403).send("Unauthorized");
        }
        res.render('jobs/update', { title: 'Update Job', job, errorMessage: null });
    }

    postUpdateJob(req, res) {
        const id = req.params.id;
        const job = JobModel.getById(id);
        if (!job || job.recruiterId !== req.session.user.id) {
            return res.status(403).send("Unauthorized");
        }

        JobModel.update(id, req.body);
        res.redirect(`/jobs/${id}`);
    }

    deleteJob(req, res) {
        const id = req.params.id;
        const job = JobModel.getById(id);
        if (!job || job.recruiterId !== req.session.user.id) {
            return res.status(403).send("Unauthorized");
        }
        JobModel.delete(id);
        res.redirect('/jobs');
    }

    getApplicants(req, res) {
        const id = req.params.id;
        const job = JobModel.getById(id);
        if (!job || job.recruiterId !== req.session.user.id) {
            return res.status(403).send("Unauthorized");
        }
        res.render('jobs/applicants', { title: 'Applicants', job, applicants: job.applicants });
    }

    async postApply(req, res) {
        const id = req.params.id;
        const job = JobModel.getById(id);
        if (!job) {
            return res.status(404).render('404', { title: 'Job Not Found' });
        }

        const { name, email, contact } = req.body;
        const resumePath = req.file ? `/uploads/${req.file.filename}` : '';

        JobModel.addApplicant(id, { name, email, contact, resumePath });

        // Send email
        await sendConfirmationEmail(email, job.designation);

        res.redirect('/jobs');
    }

    searchJobs(req, res) {
        const query = req.query.q || '';
        const jobs = JobModel.search(query);
        res.render('jobs/list', { title: 'Search Results', jobs, user: req.session.user, searchQuery: query });
    }
}
