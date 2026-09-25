
class Job {
    constructor(companyId, id, title, description, salary) {
        this.companyId = companyId;
        this.id = id;
        this.title = title;
        this.description = description;
        this.salary = salary;
        this.active = 1;
        this.createdAt = new Date().toLocaleDateString('en-CA');
    }
}