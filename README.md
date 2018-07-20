## Bucket Policy Editor

```
{
    "Version": "2012-10-17",
    "Id": "Policy1531943908491",
    "Statement": [
        {
            "Sid": "Stmt1531943904542",
            "Effect": "Allow",
            "Principal": {
                "AWS": "COPY ARN FROM IAM CREATED USER HERE"
            },
            "Action": [
                "s3:DeleteObject",
                "s3:GetObject",
                "s3:PutObject",
                "s3:Get*",
                "s3:Put*"
            ],
            "Resource": "arn:aws:s3:::NAME-OF-BUCKET/*"
        }
    ]
}
```

## CORS Configuration
```
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
<CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
</CORSRule>
</CORSConfiguration>
```

## .env - make sure you add to your .gitignore!
```
S3_BUCKET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```
